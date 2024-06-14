import { OverlayModal } from '@affine/component';
import { openIssueFeedbackModalAtom } from '@affine/core/atoms';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import { useAtom } from 'jotai';

export const IssueFeedbackModal = () => {
  const t = useAFFiNEI18N();
  const [open, setOpen] = useAtom(openIssueFeedbackModalAtom);

  return (
    <OverlayModal
      open={open}
      topImage={
        <video
          width={400}
          height={300}
          style={{ objectFit: 'cover' }}
          src={'/static/newIssue.mp4'}
          autoPlay
          loop
        />
      }
      title={t['com.affine.issue-feedback.title']()}
      onOpenChange={setOpen}
      description={t['com.affine.issue-feedback.description']()}
      cancelText={t['com.affine.issue-feedback.cancel']()}
      to={`${runtimeConfig.githubUrl}/issues/new/choose`}
      confirmText={t['com.affine.issue-feedback.confirm']()}
      confirmButtonOptions={{
        type: 'primary',
      }}
      external
    />
  );
};
