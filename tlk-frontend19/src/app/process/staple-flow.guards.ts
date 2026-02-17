import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StapleFlowService } from './staple-flow.service';

export const processStepGuard: CanActivateFn = () => {
  const router = inject(Router);
  const flowService = inject(StapleFlowService);

  if (flowService.canEnterProcess()) {
    return true;
  }

  return router.createUrlTree(['/upload']);
};

export const summaryStepGuard: CanActivateFn = () => {
  const router = inject(Router);
  const flowService = inject(StapleFlowService);

  if (flowService.canEnterSummary()) {
    return true;
  }

  if (flowService.hasCompletedUpload()) {
    return router.createUrlTree(['/process']);
  }

  return router.createUrlTree(['/upload']);
};
