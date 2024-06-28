import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontKey, GoodieType, SnapType } from '../interfaces/goodies';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import goodies from '../helpers/goodies';
import interact from 'interactjs';
import html2canvas from 'html2canvas';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-goodies',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent],
  templateUrl: './goodies.component.html',
  styleUrl: './goodies.component.scss'
})
export class GoodiesComponent implements OnInit, OnDestroy {
  public snaps: BehaviorSubject<SnapType[]> = new BehaviorSubject<SnapType[]>([]);
  private countSnaps: number = 0;
  public pending: boolean = false;
  public magnetable: boolean = false;
  public placeholder: string = 'Votre texte';

  public subscriptions: Subscription[] = [];
  public goodie!: GoodieType;

  public download: boolean = false;

  private currentFontIndex: number = 0;
  private fonts = ['roboto', 'indie', 'berlin', 'play', 'macondo'];

  @ViewChild('goodieContainer', { static: true })
  public goodieContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute
  ) {
    const params$ = this.route.paramMap.subscribe(params => {
      const goodiename = params.get('goodiename') as string;

      goodies
        .filter((goodie) => goodie.name === goodiename)
        .map((goodie) => {
          this.goodie = goodie
        });
    });

    this.subscriptions.push(params$);
  }

  ngOnInit() {
    this.initDraggable();
    this.initResizable();

    const snaps$ = this.snaps.subscribe((snaps) => {
      this.download = snaps.length > 0;
    });

    this.subscriptions.push(snaps$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public enableMagnetable(bool: boolean) {
    this.magnetable = bool;
  }

  private initDraggable(): void {
    interact('.draggable').draggable({
      inertia: true,
      listeners: {
        move: (event) => {
          const target = event.target;
          // keep the dragged position in the data-x/data-y attributes
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          // translate the element
          target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);

          if (this.magnetable) {
            this.showAlignmentLines(target);

            const frameRect = this.goodieContainer.nativeElement.getBoundingClientRect();
            this.snapToAlignment(target, frameRect, event.dx, event.dy);
          }
        },
        end: () => {
          this.hideAlignmentLines();
        }
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ]
    });
  }

  private initResizable(): void {
    interact('.resizable').resizable({
      margin: 10,
      inertia: true,
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move: (event) => {
          const target = event.target;
          const parentDiv = target.parentElement;

          if (!parentDiv) return;

          const parentRect = parentDiv.getBoundingClientRect();

          const x = parseFloat(parentDiv.getAttribute('data-x')) || 0;
          const y = parseFloat(parentDiv.getAttribute('data-y')) || 0;

          let width = parseFloat(parentDiv.style.width) || parentRect.width;
          let height = parseFloat(parentDiv.style.height) || parentRect.height;

          // Calculer les nouvelles dimensions
          width += event.deltaRect.width;
          height += event.deltaRect.height;

          // Calculer le décalage pour le centrage
          const offsetX = (width - parentRect.width) / 2;
          const offsetY = (height - parentRect.height) / 2;

          // Redimensionner et repositionner la div parente
          parentDiv.style.width = `${width}px`;
          parentDiv.style.height = `${height}px`;
          parentDiv.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px)`;

          // Mettre à jour les données de position de la div parente
          parentDiv.setAttribute('data-x', (x - offsetX).toString());
          parentDiv.setAttribute('data-y', (y - offsetY).toString());

          // Redimensionner l'image (target)
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;

          // Mettre à jour les données de position de l'image (target)
          const targetX = parseFloat(target.getAttribute('data-x')) || 0;
          const targetY = parseFloat(target.getAttribute('data-y')) || 0;
          target.setAttribute('data-x', (targetX - offsetX).toString());
          target.setAttribute('data-y', (targetY - offsetY).toString());

          if (this.magnetable) {
            this.showAlignmentLines(parentDiv);

            const frameRect = this.goodieContainer.nativeElement.getBoundingClientRect();
            this.snapToAlignment(parentDiv, frameRect, event.deltaRect.left, event.deltaRect.top);
          }
        },
        end: () => {
          this.hideAlignmentLines();
        }
      },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: '.goodie-frame',
          endOnly: true
        }),
        interact.modifiers.aspectRatio({
          ratio: 'preserve',
        }),
        interact.modifiers.restrictSize({
          min: { width: 50, height: 50 },
        })
      ],
    });
  }

  public addSnap(type: 'text' | 'image', content?: string, width?: number, height?: number): void {
    const id = this.countSnaps++;
    const frame = this.goodieContainer.nativeElement as HTMLDivElement;

    const frameRect = frame.getBoundingClientRect();

    let x: number, y: number;

    if (type === 'image' && width && height) {
      console.log((frameRect.width / 2) - (width / 2));
      x = (frameRect.width / 2) - (width / 2);
      y = (frameRect.height / 2) - (height / 2);
    } else {
      x = (frameRect.width / 2) - (115 / 2);
      y = (frameRect.height / 2) - (115 / 2);
    }

    const currentSnaps = this.snaps.getValue();

    // Ajouter l'élément réel à la liste des snaps
    this.snaps.next([...currentSnaps, {
      id,
      type,
      x,
      y,
      content: content ? content : '',
      edit: true
    }]);

    // Initialiser les interactions sur le nouvel élément
    if (type === 'image') {
      this.initResizable();
    }

    this.initDraggable();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      let w: number, h: number;

      reader.onload = (e: any) => {
        const image = new Image();
        image.onload = () => {
          const width = image.width;
          const height = image.height;

          if (width >= 300) {
            w = 300;
          } else {
            w = width;
          }

          if (height >= 300) {
            h = 300;
          } else {
            h = height;
          }

          this.addSnap('image', e.target.result, w, h);
          input.value = '';
        };
        image.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  private snapToAlignment(target: HTMLElement, frameRect: DOMRect, dx: number, dy: number): void {
    const snapThreshold = 5; // Distance à laquelle l'alignement est considéré
    const snapMargin = 0; // Marge pour désactiver l'alignement

    // Récupérer les positions actuelles
    let offsetX = parseFloat(target.getAttribute('data-x')!) || 0;
    let offsetY = parseFloat(target.getAttribute('data-y')!) || 0;

    // Calculer les nouveaux décalages
    offsetX += dx;
    offsetY += dy;

    // Calculer les centres
    const targetRect = target.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const frameCenterX = frameRect.left + frameRect.width / 2;
    const frameCenterY = frameRect.top + frameRect.height / 2;

    // Vérifier et ajuster l'alignement horizontal
    if (Math.abs(targetCenterX - frameCenterX) < snapThreshold) {
      const deltaX = frameCenterX - targetCenterX;
      offsetX += deltaX;
    } else if (Math.abs(targetCenterX - frameCenterX) > snapMargin) {
      // Sortir de l'alignement horizontal
      offsetX -= dx; // Annuler le déplacement en x si l'élément sort de l'alignement
    }

    // Vérifier et ajuster l'alignement vertical
    if (Math.abs(targetCenterY - frameCenterY) < snapThreshold) {
      const deltaY = frameCenterY - targetCenterY;
      offsetY += deltaY;
    } else if (Math.abs(targetCenterY - frameCenterY) > snapMargin) {
      // Sortir de l'alignement vertical
      offsetY -= dy; // Annuler le déplacement en y si l'élément sort de l'alignement
    }

    // Appliquer la transformation combinée
    target.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    target.setAttribute('data-x', offsetX.toString());
    target.setAttribute('data-y', offsetY.toString());
  }

  public showAlignmentLines(target: HTMLElement): void {
    const frame = this.goodieContainer.nativeElement;
    const frameRect = frame.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const verticalLine = document.getElementById('alignment-line-vertical');
    const horizontalLine = document.getElementById('alignment-line-horizontal');

    if (!verticalLine || !horizontalLine) return;

    const snapThreshold = 10; // Distance à laquelle l'alignement est considéré

    // Calculer les centres
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    // Alignement au centre du cadre
    const frameCenterX = frameRect.left + frameRect.width / 2;
    const frameCenterY = frameRect.top + frameRect.height / 2;

    // Afficher ou masquer les lignes en fonction de la distance
    verticalLine.style.display = Math.abs(targetCenterX - frameCenterX) < snapThreshold ? 'block' : 'none';
    horizontalLine.style.display = Math.abs(targetCenterY - frameCenterY) < snapThreshold ? 'block' : 'none';

    // Positionner les lignes
    verticalLine.style.left = `${frameCenterX - frameRect.left}px`;
    horizontalLine.style.top = `${frameCenterY - frameRect.top}px`;
  }

  public hideAlignmentLines() {
    const verticalLine = document.getElementById('alignment-line-vertical');
    const horizontalLine = document.getElementById('alignment-line-horizontal');

    if (!verticalLine || !horizontalLine) return;

    verticalLine.style.display = 'none';
    horizontalLine.style.display = 'none';
  }

  public export() {
    const cadre = document.getElementById('cadre');

    if (this.snaps.getValue().length > 0) {
      cadre && cadre.classList.add('hide-background');
      this.pending = true;

      setTimeout(() => {
        cadre && html2canvas(cadre, { backgroundColor: null, scale: 2 }).then(canvas => {
          this.convertToBlackAndWhite(canvas);
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'cadre.png';
          link.click();

          cadre.classList.remove('hide-background');
          this.pending = false;
        });
      }, 500);
    } else {

    }
  }

  private convertToBlackAndWhite(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Rouge
      data[i + 1] = avg; // Vert
      data[i + 2] = avg; // Bleu
    }

    ctx.putImageData(imageData, 0, 0);
  }

  public textItalic(snap: SnapType) {
    const currentSnap = this.snaps.getValue().filter((s) => s.id === snap.id);

    snap.italic = !currentSnap[0].italic
  }

  public textBold(snap: SnapType) {
    const currentSnap = this.snaps.getValue().filter((s) => s.id === snap.id);

    snap.bold = !currentSnap[0].bold
  }

  public textEditable(snap: SnapType) {
    const currentSnap = this.snaps.getValue().filter((s) => s.id === snap.id);

    snap.edit = !currentSnap[0].edit;
  }

  public textFamily(snap: SnapType) {
    if (!snap.family) {
      snap.family = {};
    }

    // Reset all fonts to false
    this.fonts.forEach(font => {
      snap.family![font as FontKey] = false;
    });

    // Set the current font to true
    const currentFont = this.fonts[this.currentFontIndex] as FontKey;
    snap.family[currentFont] = true;

    // Increment the font index
    this.currentFontIndex = (this.currentFontIndex + 1) % this.fonts.length;
  }

  public textOnFocus(event: FocusEvent) {
    const target = event.target as HTMLSpanElement;
    target.classList.remove('editable');
  }

  public textOnBlur(event: FocusEvent, snap: SnapType) {
    const target = event.target as HTMLSpanElement;

    snap.edit = false;

    if (target.innerText.length === 0) {
      target.classList.add('editable');
    }
  }

  public removeSnap(snap: SnapType) {
    const index = this.snaps.getValue().findIndex((s) => s.id === snap.id);

    if (index !== -1) {
      this.snaps.getValue().splice(index, 1);
    }

    if (index === 0) {
      this.download = false;
    }
  }
}
