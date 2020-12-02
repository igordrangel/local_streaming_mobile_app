import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { KoalaQuestionService } from 'ngx-koala';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public questionUpdateIsOpen = false;
  public updateIsAvailable = false;
  
  constructor(
    private question: KoalaQuestionService,
    private swUpdater: SwUpdate
  ) {}
  
  ngOnInit() {
    if (this.swUpdater.isEnabled) {
      this.checkForUpdates();
    }
  }
  
  public updateAndInstallUpdates() {
    location.reload();
  }
  
  private installUpdate() {
    this.swUpdater.checkForUpdate().then();
    this.swUpdater.available.subscribe(event => {
      if (!this.questionUpdateIsOpen) {
        this.questionUpdateIsOpen = true;
        this.question.open({
          message: 'Olá, existe uma nova versão disponível!<br/>Deseja atualizar agora?'
        }, () => this.swUpdater.activateUpdate().then(() => this.updateAndInstallUpdates()), () => {
          this.updateIsAvailable = true;
          this.questionUpdateIsOpen = false;
        });
      }
    });
  }
  
  private checkForUpdates() {
    this.installUpdate();
    const timeInterval = interval(20000);
    timeInterval.subscribe(async () => {
      if (!this.updateIsAvailable) {
        this.installUpdate();
      }
    });
  }
}
