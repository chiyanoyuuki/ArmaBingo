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
  gamelaunched = false;
  actiontoadd = {action:"",prenom:""};
  joueurSelected = "";

  ngOnInit()
  {
    const params = new URLSearchParams(window.location.search);
    if(params.get('joueur')) this.joueur = params.get('joueur')!;
    this.loadSiteData();
  }

  loadSiteData() {
    this.http.get<any>("https://chiyanh.cluster031.hosting.ovh.net/getArmaBingo.php").subscribe(data => {
      this.gamelaunched = data.find((d:any)=>d.id==-1).completed;
      this.actions = data.filter((d:any)=>d.id>0);
      this.actions.forEach((a:any) => {
        a.prenom = a.prenom.charAt(0).toUpperCase() + a.prenom.slice(1).toLowerCase();
      });
      console.log(this.actions);
      //this.actions = this.actions.sort(() => Math.random() - 0.5);
    });
  }
  openPopup(item: any) {
    if(item.completed&&this.joueur!="Charles")return;
    if(item.prenom==this.joueur&&this.joueur!="Charles")return;
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

  validate2() {
    this.complete2();
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

  goToSite() {
    window.location.href = 'https://chiyanh.cluster031.hosting.ovh.net/getArmaBingo.php';
  }

  getJoueurs(){
    const prenoms:string[] = Array.from(
      new Set(this.actions.map((a:any) => a.prenom))
    );
    return prenoms.filter((p:any)=>p!="Charles");
  }

  getJoueurs2(){
    const prenoms:string[] = Array.from(
      new Set(this.actions.map((a:any) => a.prenom))
    );
    return prenoms;
  }

  getActions(){
    if(this.joueurSelected=="")return this.actions;
    return this.actions.filter((a:any)=>a.prenom==this.joueurSelected);
  }
  
  getCompleted(){
    return this.actions.filter((a:any)=>a.completed).length + " / " + this.actions.length;
  }
  
  getJoueur(j:any){
    let jou = this.actions.filter((a:any)=>a.prenom==j);
    return jou.filter((a:any)=>a.completed).length + " / " + jou.length;
  }

  complete(){
    this.http.post<any>("https://chiyanh.cluster031.hosting.ovh.net/setArmaBingo.php", {id:this.selectedItem.id, completed:this.selectedItem.completed?0:1})
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

  complete2(){
    this.http.post<any>("https://chiyanh.cluster031.hosting.ovh.net/addArmaBingo.php", {prenom:this.selectedItem.prenom,action:this.selectedItem.action})
      .subscribe({
        next: (res) => {
          this.actiontoadd.prenom = "";
          this.actiontoadd.action = "";
        },
        error: (err) => {
          console.error(err);
          alert('Erreur serveur');
        }
      });
  }


  launchGame(){
    this.http.post<any>("https://chiyanh.cluster031.hosting.ovh.net/launchArmaBingo.php", {id:(this.gamelaunched?0:1)})
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


  reinitGame(){
    this.http.post<any>("https://chiyanh.cluster031.hosting.ovh.net/reinitArmaBingo.php", {id:(this.gamelaunched?0:1)})
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
}
