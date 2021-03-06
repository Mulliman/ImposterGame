import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'you', loadChildren: './pages/you/you.module#YouPageModule' },
  { path: 'new-game', loadChildren: './pages/new-game/new-game.module#NewGamePageModule' },
  { path: 'new-round', loadChildren: './pages/new-round/new-round.module#NewRoundPageModule' },
  { path: 'current-round', loadChildren: './pages/current-round/current-round.module#CurrentRoundPageModule' },
  { path: 'choose-imposter', loadChildren: './pages/choose-imposter/choose-imposter.module#ChooseImposterPageModule' },
  { path: 'imposter-guess', loadChildren: './pages/imposter-guess/imposter-guess.module#ImposterGuessPageModule' },
  { path: 'round-scores', loadChildren: './pages/round-scores/round-scores.module#RoundScoresPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
