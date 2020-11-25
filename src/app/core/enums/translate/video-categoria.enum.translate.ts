import { VideoCategoriaEnum } from '../video-categoria.enum';
import { EnumTranslate } from '../enum.translate';

export class VideoCategoriaEnumTranslate {
	
	public static translate(tipo: VideoCategoriaEnum): EnumTranslate {
		const result = {
			value: tipo
		} as EnumTranslate;
		
		switch (tipo) {
			case VideoCategoriaEnum.acao:
				result.name = 'Ação';
				break;
			case VideoCategoriaEnum.comedia:
				result.name = 'Comédia';
				break;
			case VideoCategoriaEnum.documentario:
				result.name = 'Documentário';
				break;
			case VideoCategoriaEnum.epico:
				result.name = 'Épico';
				break;
			case VideoCategoriaEnum.fantasia:
				result.name = 'Fantasia';
				break;
			case VideoCategoriaEnum.ficcaoCientifica:
				result.name = 'Ficção Científica';
				break;
			case VideoCategoriaEnum.guerra:
				result.name = 'Guerra';
				break;
			case VideoCategoriaEnum.suspense:
				result.name = 'Suspense';
				break;
			case VideoCategoriaEnum.terror:
				result.name = 'Terror';
				break;
			case VideoCategoriaEnum.thriller:
				result.name = 'Thriller';
				break;
		}
		
		return result;
	}
}
