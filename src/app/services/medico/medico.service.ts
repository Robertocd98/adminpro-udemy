import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';

import swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {  }

  cargarMedicos() {

    let url = URL_SERVICIOS + '/medico';

    return this.http.get(url)
                .map((resp: any) => {

                  this.totalMedicos = resp.total;
                  return resp.medicos;

                });

  }

  buscarMedicos( termino:string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get( url )
                .map( (resp: any) => resp.medicos );

  }

  borrarMedico( id: string ) {

    let url = URL_SERVICIOS + '/medico/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete(url)
                .map(() => {
                  swal.fire({
                    title: 'Medico borrado',
                    text: 'El medico a sido eliminado correctamente',
                    icon: 'success',
                });
                return true;
                });

  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // actualizando

      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico )
                      .map( (resp: any) => {


                        swal.fire({
                          title: 'Medico actualizado',
                          text: resp.medico.nombre,
                          icon: 'success',

                        });

                        return resp.medico;

                      });

    } else {
      // creando

      url += '?token=' + this._usuarioService.token;

      return this.http.post( url, medico )
                .map( (resp: any) => {

                  swal.fire({
                    title: 'Medico Creado',
                    text: resp.medico.nombre,
                    icon: 'success',

                  });

                  return resp.medico;

                });

    };

  }

  cargarMedico( id: string ) {

    let url = URL_SERVICIOS + '/medico/' + id;
  
    return this.http.get( url )
            .map( (resp: any) => resp.medico );

  }

}
