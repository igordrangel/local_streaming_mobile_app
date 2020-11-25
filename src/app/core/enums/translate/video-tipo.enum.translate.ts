import { VideoTipoEnum } from '../video-tipo.enum';
import { EnumTranslate } from '../enum.translate';

export class VideoTipoEnumTranslate {
	
	public static translate(tipo: VideoTipoEnum): EnumTranslate {
		const result = {
			value: tipo
		} as EnumTranslate;
		
		switch (tipo) {
			case VideoTipoEnum.filme:
				result.name = 'Filme';
				break;
			case VideoTipoEnum.serie:
				result.name = 'Série';
				break;
		}
		
		return result;
	}
}
