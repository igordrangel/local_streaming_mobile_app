import { koala } from 'koala-utils';
import { VideoTipoEnumTranslate } from './enums/translate/video-tipo.enum.translate';
import { VideoTipoEnum } from './enums/video-tipo.enum';
import { EnumTranslate } from './enums/enum.translate';

export const videoTipoOptions = koala([
	VideoTipoEnumTranslate.translate(VideoTipoEnum.filme),
	VideoTipoEnumTranslate.translate(VideoTipoEnum.serie)
]).array<EnumTranslate>().orderBy('name').getValue();
