import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File = null;
  imagenTem: string | ArrayBuffer;

  constructor(
    public _usuarioService: UsuarioService
  ) {
    this.usuario = _usuarioService.usuario;
   }

  ngOnInit() {
  }

  guardar(usuario: Usuario) {

    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }
    this.usuario.email = usuario.email;

    this._usuarioService.actualizarUsuario( this.usuario )
                .subscribe();

  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      swal.fire({
        title: 'Solo imagenes',
        text: 'el archivo seleccionado no es una imagen',
        icon: 'error',
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTem = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTem = reader.result;

  }

  cambiarImagen() {

    this._usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id );

  }

}
