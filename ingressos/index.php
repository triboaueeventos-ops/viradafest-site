<?php
// viradafest.com.br/ingressos  ->  redireciona para o site de venda.
// TROQUE SOMENTE O LINK E A DATA ENTRE ASPAS ABAIXO.
$link_venda    = 'https://4ticket.app/eventos/reveillon-viradafest-2027-casa-pampulha/';
$vendas_abrem  = '2026-10-10 00:00:00'; // horário de Brasília

date_default_timezone_set('America/Sao_Paulo');
if ($link_venda === '' || time() < strtotime($vendas_abrem)) {
  // Antes da abertura: volta para o site, que mostra o aviso "vendas ainda não começaram".
  $link_venda = '/#setores';
}
header('Cache-Control: no-store');
header('Location: ' . $link_venda, true, 302);
exit;
