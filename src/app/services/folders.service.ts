import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Folder} from './folder';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FoldersService {

  public subject = new BehaviorSubject<Folder[]>([]);
  private foldersList: Folder[];
  public link: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  public getData() {
    this.http.get('/assets/folders.json').subscribe((data: { folders: Folder[] }) => {
        this.foldersList = data.folders;
        this.subject.next(data.folders);
      }
    );
  }

  public findFold(urls: string[]): Folder {
    // console.log(urls);
    let findFolder;
    for (let i = 0; i < urls.length; i++) {
      for (const folder in this.foldersList) {
        if (this.foldersList[folder].id === +urls[i]) {
          findFolder = this.foldersList[+folder];
        }
      }
      for (let j = 1; j < urls.length; j++) {
        findFolder.subFolders.forEach((subFolder) => {
          if (subFolder.id == urls[+j]) {
            findFolder = subFolder;
          }
        });
      }
      if (findFolder) {
        return findFolder;
      }
    }
  }

  public save(newFolder: Folder) {
    if (this.link == null) {
      this.foldersList.push(newFolder);
      this.subject.next(this.foldersList);
    } else {
      // console.log(this.link)
      const array = this.link.replace('/folders/', '').split('/');
      // console.log(array);

      const findFolder: Folder = this.findFold(array);
      findFolder.subFolders.push(newFolder);
      // console.log(findFolder);
      this.link = this.router.navigate([this.link + '/' + newFolder.id]);
      // console.log(findFolder);
      // console.log(this.link);
    }
  }
}
