import { Component, OnInit } from '@angular/core';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetasService } from 'src/app/services/tarjetas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css'],
})
export class ListarTarjetaComponent implements OnInit {
  listTarjetas: TarjetaCredito[] = [];

  constructor(
    private _tarjetaService: TarjetasService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCards();
  }

  getCards() {
    this._tarjetaService.getCards().subscribe((doc) => {
      this.listTarjetas = [];
      console.log(doc);
      doc.forEach((element: any) => {
        this.listTarjetas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
        console.log(element.payload.doc.data());
      });
    });
  }

  eliminarTarjeta(id: any) {
    this._tarjetaService.eliminarTarjeta(id).then(
      () => {
        this.toastr.error(
          'Registro eliminado',
          'La tarjeta fue eliminada con exito'
        );
      },
      (err) => {
        this.toastr.error('Opps ocurrio un error', 'Error');
        console.log(err);
      }
    );
  }

  editarTarjeta(tarjeta: TarjetaCredito){
    this._tarjetaService.addCardEdit(tarjeta)
  }
}
