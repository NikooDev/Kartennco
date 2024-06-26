import { Component, OnInit, HostListener } from '@angular/core';
import interact from 'interactjs';
import html2canvas from 'html2canvas';
import { CommonModule, NgOptimizedImage } from '@angular/common';

interface ItemType {
  id: number
  type: string
  content?: string
  x: number
  y: number
  src?: string
  width?: number
  height?: number
}

@Component({
  selector: 'app-goodies',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './goodies.component.html',
  styleUrl: './goodies.component.scss'
})
export class GoodiesComponent implements OnInit {
  public editable: boolean = true;
  public resizable: boolean = false;

  public items: ItemType[] = [
    { id: 1, type: 'text', content: 'Texte exemple', x: 0, y: 0 },
    { id: 2, type: 'image', src: 'image.png', x: 100, y: 100, width: 200, height: 150 }
  ];

  ngOnInit() {
    this.initDraggable();
    this.initResizable();
  }

  public resize(event: MouseEvent) {
    if (!this.resizable) {
      this.resizable = true;
    }
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;

    // Vérifier si l'élément cliqué est une partie de l'image ou non
    if (!clickedElement.closest('.image')) {
      // Si le clic est en dehors de l'image, désactiver le redimensionnement
      this.resizable = false;
    }
  }

  public initDraggable() {
    interact('.draggable-item').draggable({
      listeners: {
        start(event) {
          console.log(event.type, event.target);
        },
        move(event) {
          const target = event.target;

          // Obtenez les dimensions du cadre
          const cadre = document.getElementById('cadre');
          if (!cadre) return;

          const cadreRect = cadre.getBoundingClientRect();

          // Calculez la nouvelle position de l'élément en fonction de la position absolue de la souris
          const x = event.pageX - cadreRect.left - (target.offsetWidth / 2);
          const y = event.pageY - cadreRect.top - (target.offsetHeight / 2);

          // Limitez les nouvelles positions
          const minX = 0;
          const minY = 0;
          const maxX = cadreRect.width - target.offsetWidth;
          const maxY = cadreRect.height - target.offsetHeight;

          const constrainedX = Math.min(Math.max(x, minX), maxX);
          const constrainedY = Math.min(Math.max(y, minY), maxY);

          // Mettez à jour la position de l'élément
          target.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`;

          // Mettez à jour les attributs de données pour la nouvelle position
          target.setAttribute('data-x', constrainedX.toString());
          target.setAttribute('data-y', constrainedY.toString());
        },
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ]
    });
  }

  public initResizable() {
    interact('.resizable-item')
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true }
      })
      .on('resizemove', (event) => {
        const target = event.target;
        const x = parseFloat(target.getAttribute('data-x')) || 0;
        const y = parseFloat(target.getAttribute('data-y')) || 0;

        // Nouvelles dimensions du rectangle de redimensionnement
        const rect = event.rect;

        // Calcul du ratio actuel de l'image
        const initialWidth = parseFloat(target.getAttribute('data-initial-width')) || rect.width;
        const aspectRatio = target.getAttribute('data-aspect-ratio') || (initialWidth / rect.height).toFixed(2);

        // Calcul des nouvelles dimensions en conservant le ratio
        let newWidth = rect.width;
        let newHeight = rect.height;

        if (event.edges.top || event.edges.bottom) {
          newHeight = rect.height;
          newWidth = newHeight * parseFloat(aspectRatio);
        } else {
          newWidth = rect.width;
          newHeight = newWidth / parseFloat(aspectRatio);
        }

        // Appliquer les nouvelles dimensions
        target.style.width = `${newWidth}px`;
        target.style.height = `${newHeight}px`;

        // Mettre à jour les attributs de données
        target.setAttribute('data-width', newWidth.toString());
        target.setAttribute('data-height', newHeight.toString());

        // Positionner l'élément
        target.style.transform = `translate(${x}px, ${y}px)`;
      })
      .on('resizestart', (event) => {
        // Stocker les dimensions initiales lors du démarrage du redimensionnement
        const target = event.target;
        const rect = target.getBoundingClientRect();
        target.setAttribute('data-initial-width', rect.width.toString());
        target.setAttribute('data-aspect-ratio', (rect.width / rect.height).toFixed(2));
      });
  }

  public updateText(item: any, event: any) {
    item.content = event.target.innerText;
  }

  public export() {
    const cadre = document.getElementById('cadre');

    cadre && cadre.classList.add('hide-border');

    cadre && html2canvas(cadre, { backgroundColor: null, scale: 2 }).then(canvas => {
      this.convertToBlackAndWhite(canvas);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'cadre.png';
      link.click();

      cadre.classList.remove('hide-border');
    });
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
}
