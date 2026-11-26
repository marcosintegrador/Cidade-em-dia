import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((erro) => console.error('Não foi possível iniciar a aplicação:', erro));
