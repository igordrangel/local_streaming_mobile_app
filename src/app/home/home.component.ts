import { Component } from '@angular/core';
import { LocalStreamingService } from '../core/local-streaming.service';
import { VideoTipoEnum } from '../core/enums/video-tipo.enum';

@Component({
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.css']
})
export class HomeComponent {
	public videos$ = this.buscar();
	public filmes$ = this.buscar(VideoTipoEnum.filme);
	public series$ = this.buscar(VideoTipoEnum.serie);

	constructor(
		private localStreamingService: LocalStreamingService
	) {
	}

	public buscar(tipo?: VideoTipoEnum) {
		const filter = {sort: 'e.id', order: 'DESC', page: 0, limit: 10, tipo};
		if (!tipo) {
			delete filter.tipo;
		}
		return this.localStreamingService.getLista(filter);
	}
}
