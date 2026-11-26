import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CategoriaDados,
  Nivel,
  NIVEIS,
  NovaOcorrencia,
  Ocorrencia,
} from '../../compartilhado/models';

@Component({
  selector: 'app-ocorrencia-dialogo',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ editando ? 'Editar ocorrência' : 'Nova ocorrência' }}</h2>
    <form #formulario="ngForm" (ngSubmit)="salvar()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Categoria</mat-label>
          <mat-select name="categoriaId" required [(ngModel)]="formularioDados.categoriaId">
            @for (categoria of dados.categorias; track categoria.id) {
              <mat-option [value]="categoria.id">{{ categoria.nome }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Descrição</mat-label>
          <textarea
            matInput
            name="descricao"
            rows="3"
            required
            [(ngModel)]="formularioDados.descricao"
          ></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Urgência</mat-label>
          <mat-select name="urgencia" required [(ngModel)]="formularioDados.urgencia">
            @for (nivel of niveis; track nivel) {
              <mat-option [value]="nivel">{{ nivel }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Rua</mat-label>
          <input matInput name="rua" required [(ngModel)]="formularioDados.rua" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Número</mat-label>
          <input matInput name="numero" required [(ngModel)]="formularioDados.numero" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Bairro</mat-label>
          <input matInput name="bairro" required [(ngModel)]="formularioDados.bairro" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Cidade</mat-label>
          <input matInput name="cidade" required [(ngModel)]="formularioDados.cidade" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Ponto de referência (opcional)</mat-label>
          <input matInput name="referencia" [(ngModel)]="formularioDados.referencia" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancelar</button>
        <button
          mat-flat-button
          type="submit"
          [disabled]="formulario.invalid || !camposPreenchidos()"
        >
          Salvar
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: '.campo { width: 100%; }',
})
export class OcorrenciaDialogo {
  private readonly ref = inject(MatDialogRef<OcorrenciaDialogo, NovaOcorrencia>);
  readonly dados = inject<{ categorias: CategoriaDados[]; ocorrencia?: Ocorrencia }>(
    MAT_DIALOG_DATA,
  );

  readonly niveis = NIVEIS;
  readonly editando = !!this.dados.ocorrencia;

  formularioDados: NovaOcorrencia = this.montarFormularioInicial();

  /** Habilita o botão só quando nenhum campo obrigatório está vazio (nem só com espaços). */
  camposPreenchidos(): boolean {
    const d = this.dadosSemEspacos();
    return !!(d.categoriaId && d.descricao && d.rua && d.numero && d.bairro && d.cidade);
  }

  salvar(): void {
    if (!this.camposPreenchidos()) return;
    this.ref.close(this.dadosSemEspacos());
  }

  private montarFormularioInicial(): NovaOcorrencia {
    const existente = this.dados.ocorrencia;
    if (existente) {
      return {
        categoriaId: existente.categoriaId,
        descricao: existente.descricao,
        urgencia: existente.urgencia,
        rua: existente.rua,
        numero: existente.numero,
        bairro: existente.bairro,
        cidade: existente.cidade,
        referencia: existente.referencia,
        foto: existente.foto,
      };
    }

    const urgenciaPadrao: Nivel = 'Baixa';
    return {
      categoriaId: this.dados.categorias[0]?.id ?? 0,
      descricao: '',
      urgencia: urgenciaPadrao,
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      referencia: '',
    };
  }

  private dadosSemEspacos(): NovaOcorrencia {
    const f = this.formularioDados;
    return {
      ...f,
      descricao: f.descricao.trim(),
      rua: f.rua.trim(),
      numero: f.numero.trim(),
      bairro: f.bairro.trim(),
      cidade: f.cidade.trim(),
      referencia: (f.referencia ?? '').trim(),
    };
  }
}
