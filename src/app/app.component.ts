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
  recherche = "";
  nothere:any = [];

  ngOnInit()
  {
    const params = new URLSearchParams(window.location.search);
    if(params.get('joueur')) this.joueur = params.get('joueur')!;
    this.loadSiteData();
  }

  loadSiteData() {
    this.http.get<any>("https://chiyanh.cluster031.hosting.ovh.net/getArmaBingo.php").subscribe(data => {
      this.gamelaunched = data.find((d:any)=>d.id==-1).completed=="0"?false:true;
      this.nothere = JSON.parse(data.find((d:any)=>d.id==-2).prenom);
      console.log("nothere",this.nothere);
      this.actions = data.filter((d:any)=>d.id>0);
      this.actions.forEach((a:any) => {
        a.prenom = a.prenom.charAt(0).toUpperCase() + a.prenom.slice(1).toLowerCase();
        a.action = a.action.charAt(0).toUpperCase() + a.action.slice(1).toLowerCase();
        a.prenom = a.prenom.replace(/ */g,"");
        if(a.prenom=="N'importequi")a.prenom="N'importe qui";
        a.date = new Date(a.date).toTimeString().slice(0, 5);
        a.completed = (a.completed=="0"?false:true);
      });
      console.log(this.actions);
      //this.actions = this.actions.sort(() => Math.random() - 0.5);
    });
  }
  openPopup(item: any) {
    if(item.completed&&this.joueur!="Charles")return;
    if(item.prenom==this.joueur&&this.joueur!="Charles")return;
    if(!item.completed&&item.prenom=="Charles"&&this.joueur=="Charles")return;
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
    let prenoms:string[] = Array.from(
      new Set(this.actions.map((a:any) => a.prenom))
    );
    prenoms = prenoms.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
    return prenoms.filter((p:any)=>p!="Charles");
  }

  getJoueurs2(){
    let prenoms:string[] = Array.from(
      new Set(this.actions.map((a:any) => a.prenom))
    );
    prenoms = prenoms.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
    return prenoms;
  }

  getActions(){
    let retour = this.actions;
    if(this.joueurSelected!="") retour = retour.filter((a:any)=>a.prenom==this.joueurSelected);
    if(this.recherche!="") retour = retour.filter((a:any)=>a.prenom.toLowerCase().includes(this.recherche)||a.action.toLowerCase().includes(this.recherche));
    retour = retour.filter((a:any)=>!this.nothere.includes(a.prenom));
    return retour;
  }
  
  getCompleted(){
    let tab = this.getActions();
    return tab.filter((a:any)=>a.completed).length + " / " + tab.length;
  }
  
  getJoueur(j:any){
    let jou = this.actions.filter((a:any)=>a.prenom==j);
    return jou.filter((a:any)=>a.completed).length + " / " + jou.length;
  }

  triggerJoueur(j:any)
  {
    if(this.joueur!='Charles')return;
    if(this.nothere.includes(j))this.nothere.splice(this.nothere.indexOf(j),1);
    else this.nothere.push(j);
  }

  who(j:any){
    return this.nothere.includes(j);
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
          this.connect();
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


  shuffleGame(){
    this.http.post<any>("https://chiyanh.cluster031.hosting.ovh.net/shuffleArmaBingo.php", {id:0})
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


  modifyJoueurs(){
    this.http.post<any>("https://chiyanh.cluster031.hosting.ovh.net/modifyArmaBingo.php", {prenoms:this.nothere})
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
