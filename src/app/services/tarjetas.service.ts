import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { TarjetaCredito } from '../models/TarjetaCredito';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {

  private tarjeta$ = new Subject<any>();

  constructor( private firestore : AngularFirestore ) { }

  guardarTarjeta(tarjeta: TarjetaCredito):Promise<any>{
    return this.firestore.collection('tarjetas').add( tarjeta )
    }

  getCards():Observable<any>{
    return this.firestore.collection('tarjetas', ref => ref.orderBy('fechaCreacion','asc')).snapshotChanges()
  }

  eliminarTarjeta(id:string):Promise<any>{
     return this.firestore.collection('tarjetas').doc(id).delete();
  }

  editarTarjeta( id:string,tarjeta:any ):Promise<any>{
    return this.firestore.collection('tarjetas').doc(id).update(tarjeta)
  }

  addCardEdit( tarjeta : TarjetaCredito ){
    this.tarjeta$.next(tarjeta);
  }

  getCardEdit():Observable<TarjetaCredito>{
    return this.tarjeta$.asObservable();
  }



  }



