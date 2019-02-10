import { animate, AnimationTriggerMetadata, state, style, trigger, transition } from '@angular/animations';

// Component transition animations
export const slideInDownAnimation: AnimationTriggerMetadata =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateY(-100%)'
      }),
      animate('0.5s ease-in')
    ])
  ]);
