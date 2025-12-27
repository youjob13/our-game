import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Chapter, ChapterData } from '@cutscene/domain';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CutsceneRepository {
  private readonly http = inject(HttpClient);
  private readonly assetsPath = 'our-game/browser/cutscenes';

  async getChapterById(chapterId: string): Promise<Chapter> {
    const url = `${this.assetsPath}/${chapterId}.json`;
    const data = await firstValueFrom(this.http.get<ChapterData>(url));
    return Chapter.create(data);
  }

  async getAllChapters(): Promise<Chapter[]> {
    const url = `${this.assetsPath}/chapters.json`;
    const data = await firstValueFrom(this.http.get<ChapterData[]>(url));
    return data.map((chapterData) => Chapter.create(chapterData));
  }
}
