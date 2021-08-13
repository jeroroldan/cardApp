
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetasService } from 'src/app/services/tarjetas.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css'],
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = 'Agregar Tarjeta';
  id: string | undefined;

  constructor(
    private fb: FormBuilder,
    private _tarjetaService: TarjetasService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      fechaExpiracion: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }

  ngOnInit(): void {
    this._tarjetaService.getCardEdit().subscribe((data) => {
      console.log(data);
      this.id = data.id;
      this.titulo = 'Editar tarjeta';
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv,
      });
    });
  }

  guardarTarjeta() {
    if (this.id === undefined) {
      //creamos una nueva tarjeta
      this.agregarTarjeta();
    } else {
      //editamos una tarjeta
      this.editarTarjeta(this.id);
    }
  }

  agregarTarjeta() {
    const CARD: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    console.log(CARD);
    this._tarjetaService.guardarTarjeta(CARD).then(
      () => {
        console.log('tarjeta registrada');
        this.loading = false;
        this.toastr.success(
          'La tarjeta fue registrada con exito',
          'Tarjeta registrada'
        );
        this.form.reset();
      },
      (err: any) => {
        this.loading = false;
        this.toastr.error(
          'La tarjeta no ha sido registrada',
          'Tarjeta no registrada'
        );
        console.log(err);
      }
    );
  }

  editarTarjeta(id:string){
    const CARD: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualizacion: new Date(),
    }
    this.loading = true;
    this._tarjetaService.editarTarjeta(id,CARD).then(() =>{
      this.loading = false;
      this.titulo = 'Agregar Tarjeta';
      this.form.reset();
      this.id = undefined;
      this.toastr.info('La tarjeta fue actualizada con exito', 'Registro Actualizado')
    },err =>{
      console.log(err)
    })
  }
}
