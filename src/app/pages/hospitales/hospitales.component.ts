import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';

import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import swal from 'sweetalert2';



@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  totalHospitales: number = 0;
  nombre: string;

  cargando: boolean = true;
  desde: number = 0;


  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {

    this.obtenerHospitales();
    this._modalUploadService.notificacion
    .subscribe( () => this.obtenerHospitales());

  }

  cambiarDesde( valor: number ) {


    if (valor === 5) {
        if (this.desde + 5 >= this.totalHospitales) {
          return;
        }
        this.desde += 5;
    } else {
      if (this.desde === 0) {
        return;
      }
      this.desde += -5;
    }

    this.obtenerHospitales();
  }

  obtenerHospitales() {

    this._hospitalService.buscarHospitales( this.desde )
            .subscribe((resp: any) => {
              this.hospitales = resp.hospitales;
              this.totalHospitales = resp.total;
              this.cargando = false;
            });

  }

  buscarHospital( valor: string ) {

    if ( valor.length <= 0) {
      this.obtenerHospitales();
      return;
    }

    return this._hospitalService.buscarHospital(valor)
                .subscribe((hospitales: Hospital[]) => {
                  this.hospitales = hospitales;
                  this.cargando = false;
                });

  }

  alerta() {
    swal.fire({
      title: 'Enter your IP address',
      input: 'text',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
        this.crearHospital(value);
      }
    });

  }

  crearHospital( hospital: string ) {

    this._hospitalService.hospitalNuevo(hospital)
            .subscribe((resp) => {

              this.obtenerHospitales();

            });



  }

  nombreNuevo( valor:string ) {
    this.nombre = valor;
  }

  guardarHospital( hospital: Hospital ) {

    if (this.nombre. length <= 0) {

      swal.fire({
        title: 'Error actualizando',
        text: 'no puede dejar el nombre vacio',
        icon: 'error',
      });

      this.obtenerHospitales();
      return;
    }

    hospital.nombre = this.nombre;


    return this._hospitalService.actualizarHospital(hospital)
              .subscribe( resp => {
                this.obtenerHospitales();
              });

  }

  eliminarHospital( hospital: Hospital ) {

    swal.fire({
      title: '¿ Esta seguro?',
      text: 'Esta a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, cancelar'
    }).then( borrar => {
      console.log(borrar.value);
      if (borrar.value) {

        this._hospitalService.borrarHospital(hospital._id)
                    .subscribe( borrado => {
                      console.log(borrado);
                      this.obtenerHospitales();
                      this.desde = 5;

                      this.cambiarDesde(-5);

                    });

      }
    });

  }

  mostrarModal( id: string ) {

    this._modalUploadService.mostrarModal( 'hospitales' , id);

  }


}
