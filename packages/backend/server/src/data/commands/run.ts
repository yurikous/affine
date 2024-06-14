import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { Command, CommandRunner } from 'nest-commander';

interface Migration {
  file: string;
  name: string;
  up: (db: PrismaClient, injector: ModuleRef) => Promise<void>;
  down: (db: PrismaClient, injector: ModuleRef) => Promise<void>;
}

export async function collectMigrations(): Promise<Migration[]> {
  const folder = join(fileURLToPath(import.meta.url), '../../migrations');

  const migrationFiles = readdirSync(folder)
    .filter(desc =>
      desc.endsWith(import.meta.url.endsWith('.ts') ? '.ts' : '.js')
    )
    .map(desc => join(folder, desc));

  migrationFiles.sort((a, b) => a.localeCompare(b));

  const migrations: Migration[] = await Promise.all(
    migrationFiles.map(async file => {
      return import(pathToFileURL(file).href).then(mod => {
        const migration = mod[Object.keys(mod)[0]];

        return {
          file,
          name: migration.name,
          up: migration.up,
          down: migration.down,
        };
      });
    })
  );

  return migrations;
}
@Command({
  name: 'run',
  description: 'Run all pending data migrations',
})
export class RunCommand extends CommandRunner {
  logger = new Logger(RunCommand.name);
  constructor(
    private readonly db: PrismaClient,
    private readonly injector: ModuleRef
  ) {
    super();
  }

  override async run(): Promise<void> {
    const migrations = await collectMigrations();
    const done: Migration[] = [];
    for (const migration of migrations) {
      const exists = await this.db.dataMigration.count({
        where: {
          name: migration.name,
        },
      });

      if (exists) {
        continue;
      }

      await this.runMigration(migration);

      done.push(migration);
    }

    this.logger.log(`Done ${done.length} migrations`);
    done.forEach(migration => {
      this.logger.log(`  ✔ ${migration.name}`);
    });
  }

  async runOne(name: string) {
    const migrations = await collectMigrations();
    const migration = migrations.find(m => m.name === name);

    if (!migration) {
      throw new Error(`Unknown migration name: ${name}.`);
    }
    const exists = await this.db.dataMigration.count({
      where: {
        name: migration.name,
      },
    });

    if (exists) return;

    await this.runMigration(migration);
  }

  private async runMigration(migration: Migration) {
    this.logger.log(`Running ${migration.name}...`);
    const record = await this.db.dataMigration.create({
      data: {
        name: migration.name,
        startedAt: new Date(),
      },
    });

    try {
      await migration.up(this.db, this.injector);
    } catch (e) {
      await this.db.dataMigration.delete({
        where: {
          id: record.id,
        },
      });
      await migration.down(this.db, this.injector);
      this.logger.error('Failed to run data migration', e);
      process.exit(1);
    }

    await this.db.dataMigration.update({
      where: {
        id: record.id,
      },
      data: {
        finishedAt: new Date(),
      },
    });
  }
}

@Command({
  name: 'revert',
  arguments: '[name]',
  description: 'Revert one data migration with given name',
})
export class RevertCommand extends CommandRunner {
  logger = new Logger(RevertCommand.name);

  constructor(
    private readonly db: PrismaClient,
    private readonly injector: ModuleRef
  ) {
    super();
  }

  override async run(inputs: string[]): Promise<void> {
    const name = inputs[0];
    if (!name) {
      throw new Error('A migration name is required');
    }

    const migrations = await collectMigrations();

    const migration = migrations.find(m => m.name === name);

    if (!migration) {
      this.logger.error('Available migration names:');
      migrations.forEach(m => {
        this.logger.error(`  - ${m.name}`);
      });
      throw new Error(`Unknown migration name: ${name}.`);
    }

    const record = await this.db.dataMigration.findFirst({
      where: {
        name: migration.name,
      },
    });

    if (!record) {
      throw new Error(`Migration ${name} has not been executed.`);
    }

    try {
      this.logger.log(`Reverting ${name}...`);
      await migration.down(this.db, this.injector);
      this.logger.log('Done reverting');
    } catch (e) {
      this.logger.error(`Failed to revert data migration ${name}`, e);
    }

    await this.db.dataMigration.delete({
      where: {
        id: record.id,
      },
    });
  }
}
