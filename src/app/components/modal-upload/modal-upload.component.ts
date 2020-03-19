import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File = null;
  imagenTem: string | ArrayBuffer;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService
  ) {

  }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenTem = null;
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
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

  subirImagen() {

    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
              .then( resp => {

                this._modalUploadService.notificacion.emit(resp);
                this.cerrarModal();

              })
              .catch( err => console.log('Error al cargar imagen'));
  }

}
