import { createApp } from './app';
import { env } from './config/env';

const PORT = process.env.PORT || 3000;

createApp().then(app => {
  app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
}).catch(err => {
  console.error('Falha ao iniciar servidor', err);
  process.exit(1);
});
