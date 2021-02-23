import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { counterReducer } from '../_store/reducers/counter.reducer';
import { authReducer } from '../_store/reducers/auth.reducer';
import { userPlanReducer } from '../_store/reducers/users-plan.reducer';
import { AuthEffects } from '../_store/effects/auth.effects';
import { UserPlanEffects } from '../_store/effects/users-plan.effects';
import { changesReducer } from '../_store/reducers/changes.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('counter', counterReducer),
    StoreModule.forFeature('windowsChanges', changesReducer),
    StoreModule.forFeature('auth', authReducer),
    StoreModule.forFeature('userPlan', userPlanReducer),
    EffectsModule.forFeature([AuthEffects]),
    EffectsModule.forFeature([UserPlanEffects]),
  ],
})
export class ReducersEffectsModule {
  static forRoot(): ModuleWithProviders<ReducersEffectsModule> {
    return {
        ngModule: ReducersEffectsModule
    };
}
}
