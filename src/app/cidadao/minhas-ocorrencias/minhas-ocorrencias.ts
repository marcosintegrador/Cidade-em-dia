import { Component, computed, inject, signal } from '@angular/core';
import { AutenticacaoService } from '../../compartilhado/autenticacao-service';
import { CategoriaService } from '../../compartilhado/categoria-service';
import { OcorrenciaService } from '../../compartilhado/ocorrencia-service';

@Component({
  selector: 'app-minhas-ocorrencias',
  standalone: false,
  styleUrl: './minhas-ocorrencias.scss',
  templateUrl: './minhas-ocorrencias.html',
})
export class MinhasOcorrencias {
  private readonly servico = inject(OcorrenciaService);
  private readonly auth = inject(AutenticacaoService);
  readonly categorias = inject(CategoriaService);

  readonly filtros = [
    { rotulo: 'Todas', status: '' },
    { rotulo: 'Novas', status: 'Nova' },
    { rotulo: 'Em análise', status: 'Em análise' },
    { rotulo: 'Em andamento', status: 'Em andamento' },
    { rotulo: 'Resolvidas', status: 'Resolvida' },
  ];
  readonly filtro = signal('');

  /** Somente as ocorrências registradas pelo cidadão que está logado. */
  readonly ocorrencias = computed(() => {
    const usuarioId = this.auth.usuarioId();
    const status = this.filtro();
    return this.servico
      .lista()
      .filter((o) => o.usuarioId === usuarioId && (!status || o.status === status));
  });
}
