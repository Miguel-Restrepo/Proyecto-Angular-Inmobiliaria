import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CiudadModel } from 'src/app/models/parametrizacion/ciudad.model';
import { ClienteModel } from 'src/app/models/ventas/cliente.model';
import { PaisModel } from 'src/app/models/parametrizacion/pais.model';
import { ArchivosService } from 'src/app/services/parametrizacion/archivos.service';
import { CiudadService } from 'src/app/services/parametrizacion/ciudad.service';
import { ClienteService } from 'src/app/services/ventas/cliente.service';
import { PaisService } from 'src/app/services/parametrizacion/pais.service';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {
  fgValidator: FormGroup = this.fb.group({});
  uploadForm: FormGroup = this.fb.group({});
  codigoPais?: string;
  paises?: PaisModel[];
  ciudades?: CiudadModel[];
  constructor(
    private servicioSubida: ArchivosService,
    private fb: FormBuilder, 
    private service: ClienteService,
    private servicioSeguridad: SeguridadService,
    private servicioCiudades: CiudadService,
    private servicioPaises: PaisService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.construirFormularioCarga();
    this.FormularioValidacion();
    this.llenarPaises();
  }
  FormularioValidacion() {
    this.fgValidator = this.fb.group({
      documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido1: ['', [Validators.required]],
      apellido2: ['', []],
      fecha_nacimiento: ['', [Validators.required]],
      image: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      total_ingresos: ['', [Validators.required]],
      datos_trabajo: ['', [Validators.required]],
      nombre_ref_familiar: ['', [Validators.required]],
      telefono_ref_familiar: ['', [Validators.required]],
      nombre_ref_personal: ['', [Validators.required]],
      telefono_ref_personal: ['', [Validators.required]],
      pais: ['',[Validators.required]],
      codigo_ciudad: ['', [Validators.required]]
      
    });
  }

  RegitrarUsuario() {
    if (this.fgValidator.invalid) {
      alert('Formulario Invalido');
    } else {
      let cliente = this.getUsuarioData();
      console.log(cliente);
      this.service.creacionCliente(cliente).subscribe((data) => {
        console.log(data);
        if (data) {
          alert('Registro Exitoso');
          this.router.navigate(["/ventas/listar-cliente"]);
        } else {
          alert('Fallo el registro');
        }
      });
    }
  }
  //Obtenego datos del formulario y los paso al modelo de usuario
  getUsuarioData(): ClienteModel {
    
    let model = new ClienteModel();
    model.Documento= this.fgv.documento.value;
    model.Nombre = this.fgv.nombre.value;
    model.Apellido_1 = this.fgv.apellido1.value;
    model.Apellido_2 = this.fgv.apellido2.value;
    model.Fecha_Nacimiento= this.fgv.fecha_nacimiento.value;
    model.Foto=this.fgv.image.value.toString();
    model.Celular = this.fgv.celular.value.toString();
    model.Correo = this.fgv.correo.value;
    model.Direccion= this.fgv.direccion.value;
    model.Total_Ingresos= this.fgv.total_ingresos.value;
    model.DocumentoUsuario=this.servicioSeguridad.getDocumento();
    model.Datos_Trabajo= this.fgv.datos_trabajo.value;
    model.Nombre_Ref_Familiar= this.fgv.nombre_ref_familiar.value;
    model.Telefono_Ref_Familiar=this.fgv.telefono_ref_familiar.value.toString();
    model.Nombre_Ref_Personal=this.fgv.nombre_ref_personal.value;
    model.Telefono_Ref_Personal=this.fgv.telefono_ref_personal.value.toString();
    model.codigoCiudad=parseInt(this.fgv.codigo_ciudad.value);
    
    return model;
  }
  get fgv() {
    return this.fgValidator.controls;
  }
  //CARGA DE IMAGEN
  construirFormularioCarga(){
    this.uploadForm = this.fb.group({
      file: ['', [Validators.required]],
    });
  }
  get fgUpload(){
    return this.uploadForm.controls;
  }
  cargarImagen() {
    const formData = new FormData();
    formData.append('file', this.fgUpload.file.value);
    //LLamar Servicio
    this.servicioSubida.cargarImagen('Cliente', formData).subscribe(
      (data) => {
        this.fgv.image.setValue(data.filename);
      },
      (err) => {
        alert('Error al cargar la imagen');
      }
    );
  }
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const f = event.target.files[0];
      this.fgUpload.file.setValue(f);
    }
  }
  llenarPaises(){
    this.servicioPaises.obtenerPaises().subscribe((paises)=>{
      this.paises=paises
    });
    
    const selectorPais=document.getElementById('pais');
    if (selectorPais)
    {
      selectorPais.addEventListener('change', e => { //me permite ver cuando estoy cambiando de opcion
        const list = e.target;
        let idPais=this.fgv.pais.value;
        this.ciudades=[];
        //this.busquedaPais(idPais);//NO USAR ACTUALMENTE, DEMASIADO PESADA LA BUSQUEDA
        this.llenarCiudades(idPais);
  })
    }
  }
  llenarCiudades(id:number){
    this.servicioPaises.obtenerCiudadesPais(id).subscribe(ciudades=>{
      this.ciudades=ciudades;
      
  });
}
}
