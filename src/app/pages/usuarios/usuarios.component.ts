import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';

import swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe( resp => {
      this.cargarUsuarios();
    })
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
            .subscribe( (resp: any) => {
              console.log(resp);
              this.usuarios = resp.usuarios;
              this.totalRegistros = resp.total;
              this.cargando = false;

            });

  }

  cambiarDesde( valor: number ) {


    if (valor === 5) {
        if (this.desde + 5 >= this.totalRegistros) {
          return;
        }
        this.desde += 5;
    } else {
      if (this.desde === 0) {
        return;
      }
      this.desde += -5;
    }

    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino)
              .subscribe( (usuarios: Usuario[]) => {

                this.usuarios = usuarios;
                this.cargando = false;

              });

  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this._usuarioService.usuario._id ) {
      swal.fire({
        title: 'No se puede borrar este usaurio',
        text: 'no se puede borrar a si mismo',
        icon: 'error',
      });
      return;
    }

    swal.fire({
      title: '¿ Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, cancelar'
    }).then( borrar => {

      console.log(borrar.value);

      if (borrar.value) {

        this._usuarioService.borrarUsuario( usuario._id )
                      .subscribe( borrado => {

                        console.log( borrado );
                        this.cargarUsuarios();

                        this.desde = 5;

                        this.cambiarDesde(-5);

                      });

      }
    });

  }

  guardarUsuario( usuario: Usuario ) {

    this._usuarioService.actualizarUsuario( usuario )
            .subscribe();

  }

  mostrarModal( id: string ) {

    this._modalUploadService.mostrarModal( 'usuarios' , id);

  }

}
