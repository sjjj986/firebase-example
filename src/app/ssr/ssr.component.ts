import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ssr',
  standalone: true,
  templateUrl: './ssr.component.html',
  styleUrl: './ssr.component.scss',
})
export class SsrComponent {
  @ViewChild('date') private date?: ElementRef;
  @ViewChild('uuid') private uuid?: ElementRef;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.date) {
      this.date.nativeElement.innerText = new Date();
    }

    firstValueFrom(
      this.http.get<{ uuid: string }>('https://httpbin.org/uuid', {
        transferCache: false,
      })
    ).then(({ uuid }) => {
      if (this.uuid) {
        this.uuid.nativeElement.innerText = uuid;
      }
    });
  }
}
