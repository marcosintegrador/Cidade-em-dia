import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutenticacaoService } from '../../compartilhado/autenticacao-service';
import { CategoriaService } from '../../compartilhado/categoria-service';
import { NIVEIS, NovaOcorrencia } from '../../compartilhado/models';
import { OcorrenciaService } from '../../compartilhado/ocorrencia-service';

// A foto é guardada no navegador (localStorage), que tem pouco espaço.
const TAMANHO_MAXIMO_FOTO_BYTES = 1_500_000;

@Component({
  selector: 'app-nova-ocorrencia',
  standalone: false,
  styleUrl: './nova-ocorrencia.scss',
  templateUrl: './nova-ocorrencia.html',
})
export class NovaOcorrenciaPagina {
  private readonly servico = inject(OcorrenciaService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly auth = inject(AutenticacaoService);

  readonly categorias = inject(CategoriaService).ativas;
  readonly niveis = NIVEIS;

  nomeFoto = '';

  dados: NovaOcorrencia = {
    categoriaId: this.categorias()[0]?.id ?? 0,
    descricao: '',
    urgencia: 'Baixa',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    referencia: '',
    foto: undefined,
  };

  selecionarFoto(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const arquivo = campo.files?.[0];
    if (!arquivo || !arquivo.type.startsWith('image/')) return;

    if (arquivo.size > TAMANHO_MAXIMO_FOTO_BYTES) {
      this.avisar('A foto deve ter no máximo 1,5 MB.');
      campo.value = '';
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
      if (typeof leitor.result !== 'string') {
        this.avisar('Não foi possível carregar a foto.');
        return;
      }
      this.nomeFoto = arquivo.name;
      this.dados.foto = leitor.result;
    };
    leitor.onerror = () => this.avisar('Não foi possível carregar a foto.');
    leitor.readAsDataURL(arquivo);
  }

  registrar(): void {
    const usuarioId = this.auth.usuarioId();
    if (usuarioId === null) {
      this.avisar('Não foi possível identificar o usuário da sessão.');
      return;
    }

    try {
      this.servico.registrar(this.dados, usuarioId);
    } catch (erro) {
      this.avisar(erro instanceof Error ? erro.message : 'Não foi possível registrar a ocorrência.');
      return;
    }

    this.avisar('Ocorrência registrada.');
    this.router.navigate(['/cidadao/minhas']);
  }

  cancelar(): void {
    this.router.navigate(['/cidadao/minhas']);
  }

  private avisar(mensagem: string): void {
    this.snackBar.open(mensagem, 'OK', { duration: 3000 });
  }
}
