import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../compartilhado/usuario-service';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  styleUrl: '../autenticacao.scss',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  nome = '';
  email = '';
  senha = '';
  confirmacao = '';

  criar(): void {
    const email = this.email.trim();

    if (this.usuarios.obterPorEmail(email)) {
      this.snackBar.open('Já existe uma conta com este e-mail.', 'OK', { duration: 4000 });
      return;
    }

    // A senha só é validada no formulário: nesta versão de demonstração ela não é guardada.
    this.usuarios.cadastrar({ nome: this.nome.trim(), email, perfil: 'Cidadão' });
    this.snackBar.open('Conta criada. Faça login para continuar.', 'OK', { duration: 4000 });
    this.router.navigate(['/auth/login']);
  }
}
