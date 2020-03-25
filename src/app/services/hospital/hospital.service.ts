import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';

import swal from 'sweetalert2';
import { Hospital } from '../../models/hospital.model';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient
  ) {

    this.cargarStorage();

  }

  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  buscarHospitales( desde: number ) {

    let url = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get( url );

  }

  buscarHospital( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get(url).map( (resp: any) => resp.hospitales);

  }

  obtenerHospital( id: string ) {

    let url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get( url )
                .map( (resp: any) => resp.hospital);

  }

  hospitalNuevo( nombre: string ) {

    let url = URL_SERVICIOS + '/hospital?token=' + this.token;



    return this.http.post(url, { nombre: nombre })
              .map( resp => {
                swal.fire({
                  title: 'Hospital creado',
                  text: 'El hospital a sido creado correctamente',
                  icon: 'success',
              });
              return true;
              });

  }

  actualizarHospital( hospital: Hospital ) {

    let url = URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this.token;

    return this.http.put( url, hospital )
                .map( (resp: any) => {
                  swal.fire({
                    title: 'Hospital actualizado',
                    text: resp.hospital.nombre,
                    icon: 'success',
                });
                return true;
                })

  }

  borrarHospital( id: string ) {

    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this.token;

    return this.http.delete(url)
          .map( resp => {
            swal.fire({
              title: 'Hospital borrado',
              text: 'El hospital a sido eliminado correctamente',
              icon: 'success',
          });
          return true;
          });

  }

}
