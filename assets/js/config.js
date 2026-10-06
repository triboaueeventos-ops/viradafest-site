/* =========================================================================
   CONFIGURAÇÃO DO SITE — VIRADA FEST 2027
   Edite SOMENTE este arquivo para trocar links e integrações.
   Depois de editar, suba este arquivo de novo pelo FTP (assets/js/config.js).
   ========================================================================= */
window.VF_CONFIG = {
  // Link de compra de ingressos. TODOS os botões "Comprar" usam este link.
  // Enquanto estiver vazio, os botões abrem o WhatsApp com mensagem pronta.
  comprarUrl: 'https://4ticket.app/eventos/reveillon-viradafest-2027-casa-pampulha/',

  // Data e hora em que as vendas abrem (horário de Brasília).
  // Antes disso, os botões de compra mostram o aviso abaixo em vez de abrir o link.
  // Depois dessa hora, os botões passam a abrir o comprarUrl sozinhos (não precisa subir nada).
  vendasAbremEm: '2026-10-10T00:00:00-03:00',
  // Hora da virada (o contador da capa conta até as vendas e, depois, até a virada).
  viradaEm: '2027-01-01T00:00:00-03:00',
  vendasAviso: 'O 1º lote abre em 10 de outubro. Fale com a gente no WhatsApp para ser avisado assim que as vendas começarem.',

  // WhatsApp oficial (somente números, com 55 + DDD). CONFIRMAR com a organização.
  whatsapp: '5531996791115',
  // Outros WhatsApps que aparecem no rodapé (somente números, com 55 + DDD).
  whatsappContatos: ['5531985221590', '5531973554543', '5531985774755'],
  whatsappMensagem: 'Olá! Quero informações sobre o Réveillon Virada Fest 2027.',

  // Instagram oficial
  instagram: 'https://www.instagram.com/reveillonviradafest/',

  // Preços que aparecem nos cartões de setor. Vazio = não mostra preço.
  // Valores da venda ao público (a partir de 10/10).
  precos: {
    nota: 'Vendas ao público a partir de 10/10.',
    premium: 'R$ 240',
    mesa: 'R$ 325 por pessoa'
  },

  // Vídeo da seção "Sinta a energia". Aceita:
  //  - link do YouTube (ex: https://www.youtube.com/watch?v=XXXX ou https://youtu.be/XXXX)
  //  - arquivo .mp4 enviado pelo FTP (ex: assets/video/virada.mp4)
  // Vazio = a seção de vídeo fica escondida.
  videoUrl: '',
  videoCapa: 'assets/img/local-lounge-900.webp',

  // Google Analytics 4 (ex: G-XXXXXXXXXX). Vazio = desligado.
  ga4Id: '',

  // Meta Pixel (somente números). Vazio = desligado.
  metaPixelId: '',

  // Texto de "Produção / Realização" no rodapé. Vazio = não aparece.
  producao: 'BH Produções'
};
