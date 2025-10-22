import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private http: HttpClient) {}

  joueur = "";
  actions: any = [];
  popupVisible = false;
  selectedItem: any;

  ngOnInit()
  {
    const params = new URLSearchParams(window.location.search);
    if(params.get('joueur')) this.joueur = params.get('joueur')!;
    this.loadSiteData();
  }

  loadSiteData() {
    this.http.get<any>("https://chiyanh.cluster031.hosting.ovh.net/getArmaBingo.php").subscribe(data => {
      this.actions = data;
      //this.actions = this.actions.sort(() => Math.random() - 0.5);
    });
  }

  complete(){
    this.http.post<any>("https://chiyanh.cluster031.hosting.ovh.net/setArmaBingo.php", {id:this.selectedItem.id})
      .subscribe({
        next: (res) => {
          this.connect();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur serveur');
        }
      });
  }

  openPopup(item: any) {
    if(item.completed)return;
    if(item.prenom==this.joueur)return;
    this.selectedItem = item;
    this.popupVisible = true;
  }

  closePopup(event: MouseEvent) {
    this.popupVisible = false;
  }

  validate() {
    this.complete();
    this.popupVisible = false;
  }

  connect()
  {
    const params = new URLSearchParams(location.search);
    params.set('joueur', this.joueur);
    location.search = params.toString();
  }

  hasParam()
  {
    const params = new URLSearchParams(window.location.search);
    return params.get('joueur');
  }
}
