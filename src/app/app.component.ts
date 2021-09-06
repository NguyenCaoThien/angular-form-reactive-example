import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'form-reactive-exercise';
  forbiddenProjectNames = ['Test'];
  projectForm: FormGroup;
  isSubmitted = false;

  ngOnInit(): void{
    this.projectForm = new FormGroup({
      "projectName": new FormControl(null, [Validators.required, this.forbiddenProjectName.bind(this)], this.asyncForbiddenProjectName),
      "email": new FormControl(null, [Validators.required, Validators.email]),
      "projectStatus": new FormControl("critical"),
      "members": new FormArray([])
    });

    this.projectForm.patchValue({
      "projectName": "test"
    });
  }

  forbiddenProjectName(control: FormControl): {[s: string]: boolean} {  
    if(control.value == null){
      return null
    }
    
    if(this.forbiddenProjectNames.indexOf(control.value) !== -1){
      return {"isNameFobidden": true}
    }

    return null;
  }

  asyncForbiddenProjectName(control: FormControl): Promise<any> | Observable<any>{
   const promise = new Promise<any>((resolve, reject)=>{
     setTimeout(()=>{
      if(control.value === "testProject"){
        resolve({"isNameFobidden": true})
      }
      else{
        resolve(null);
      }
     }, 1000);
   })

   return promise;
  }

  get members(): FormArray{
    return this.projectForm.get("members") as FormArray;
  }

  onAddMembers(): void{
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.projectForm.get('members')).push(control);
  }

  onSubmit(): void{
    this.isSubmitted = true;
    console.log(this.projectForm.value)
    console.log(this.projectForm)
  }
}
