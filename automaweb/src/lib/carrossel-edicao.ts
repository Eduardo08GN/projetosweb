// Limites da edicao de slide pelo cliente.
// 220 caracteres: num slide 1080x1350 com fonte legivel (40px+), mais que
// isso vira parede de texto e mata a leitura. Limite unico, sem excecao.
export const MAX_TEXTO_SLIDE = 220;

export type EdicaoSlide = {
  slide: number; // indice 0-based do slide
  texto?: string;
  imagemUrl?: string; // fundo novo enviado pelo cliente (ja no R2, em AVIF)
};
