import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppMessageService } from '../service/app-message.service';
import { BudgetCategory, Payment } from '../model/budget';
import { BudgetService } from '../service/budget.service';
import { PaymentService } from '../service/payment.service';
import { LocaleService } from '../service/locale.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {

  eventUuid: string = '';
  expectedAmount = 0;
  plannedAmount = 0;
  paidAmount = 0;
  currencyCode?: string;

  budgetCategoryList = [] as BudgetCategory[];
  newBudgetCategory = {} as BudgetCategory;
  newPayment = {} as Payment;

  constructor(private route: ActivatedRoute,
    private budgetService: BudgetService,
    private errorService: AppMessageService,
    private paymentService: PaymentService,
    private localeService: LocaleService,
    private offcanvasService: NgbOffcanvas) {
    this.currencyCode = localeService.updateCurrencyCode();
  }

  ngOnInit(): void {
    this.eventUuid = this.route.snapshot.params['uuid'];
    this.getBudget();
  }

  private getBudget() {
    this.budgetService.getBudget(this.eventUuid).subscribe({
      next: data => {
        this.expectedAmount = data.expectedAmount;
        this.plannedAmount = data.plannedAmount;
        this.paidAmount = data.paidAmount;
        this.budgetCategoryList = data.budgetCategoryList;
      },
      error: (error) =>
        this.errorService.showFetchErrorMessageWithRedirect(error)
    })
  }

  private createBudgetCategory() {
    this.budgetService.create(this.eventUuid, this.newBudgetCategory).subscribe({
      next: data => {
        this.budgetCategoryList.push(data);
        this.plannedAmount += data.plannedAmount;
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  private updateBudgetCategory() {
    this.budgetService.update(this.eventUuid, this.newBudgetCategory).subscribe({
      next: data => {
        const index = this.budgetCategoryList.findIndex(item => item.id === data.id);
        this.plannedAmount -= this.budgetCategoryList[index].plannedAmount;
        this.budgetCategoryList[index] = data;
        this.plannedAmount += this.budgetCategoryList[index].plannedAmount;
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  onAddBudgetCategoryFormSubmit(offcanvas: any) {
    if (this.newBudgetCategory.name !== undefined) {
      offcanvas.close('Save click');
      if (this.newBudgetCategory.id !== undefined) {
        this.updateBudgetCategory();
      } else {
        this.createBudgetCategory();
      }
    }
  }

  openBudgetCategoryForm(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' }).result.then(
      () => {
        this.newBudgetCategory = {} as BudgetCategory;
      },
      () => {
        this.newBudgetCategory = {} as BudgetCategory;
      }
    );
  }

  deleteBudgetCategory(id: number) {
    this.budgetService.deleteById(this.eventUuid, id).subscribe({
      next: () => {
        const index = this.budgetCategoryList.findIndex(item => item.id === id);
        this.plannedAmount -= this.budgetCategoryList[index].plannedAmount;
        this.paidAmount -= this.budgetCategoryList[index].paidAmount;
        this.budgetCategoryList.splice(index, 1);
      },
      error: error =>
        this.errorService.showProcessErrorMessageWithRedirect(error)
    });
  }

  editBudgetCategory(budgetCategory: BudgetCategory) {
    this.newBudgetCategory.id = budgetCategory.id;
    this.newBudgetCategory.name = budgetCategory.name;
    this.newBudgetCategory.description = budgetCategory.description;
    this.newBudgetCategory.plannedAmount = budgetCategory.plannedAmount;
  }

  editPayment(budgetId: number, payment: Payment) {
    this.newPayment.id = payment.id;
    this.newPayment.expenseName = payment.expenseName;
    this.newPayment.description = payment.description;
    this.newPayment.amount = payment.amount;
    this.newPayment.budgetCategoryId = budgetId;
  }

  onAddPaymentFormSubmit(offcanvas: any) {
    if (this.newPayment.expenseName !== undefined) {
      if (this.newPayment.id !== undefined) {
        this.updatePayment();
      } else {
        this.createPayment();
      }
      offcanvas.close('Save click');
    }
  }

  private updatePayment() {
    this.paymentService.update(this.eventUuid, this.newPayment.budgetCategoryId, this.newPayment).subscribe({
      next: data => {
        const budgetCategoryIndex = this.budgetCategoryList.findIndex(item => item.id === data.budgetCategoryId);
        const budgetCategory = this.budgetCategoryList[budgetCategoryIndex];
        const index = budgetCategory.paymentList.findIndex(item => item.id === data.id);
        budgetCategory.paidAmount -= budgetCategory.paymentList[index].amount;
        this.paidAmount -= budgetCategory.paymentList[index].amount;

        budgetCategory.paymentList[index] = data;
        budgetCategory.paidAmount += data.amount;
        this.paidAmount += data.amount;
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  private createPayment() {
    this.paymentService.create(this.eventUuid, this.newPayment.budgetCategoryId, this.newPayment).subscribe({
      next: data => {
        const budgetCategoryIndex = this.budgetCategoryList.findIndex(item => item.id === data.budgetCategoryId);
        const budgetCategory = this.budgetCategoryList[budgetCategoryIndex];
        if (budgetCategory.paymentList == null) {
          budgetCategory.paymentList = [];
        }
        budgetCategory.paymentList.push(data);
        budgetCategory.paidAmount += data.amount;
        this.paidAmount += data.amount;
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  deletePayment(budgetCategoryId: number, id: number) {
    this.paymentService.deleteById(this.eventUuid, budgetCategoryId, id).subscribe({
      next: () => {
        const budgetCategoryIndex = this.budgetCategoryList.findIndex(item => item.id === budgetCategoryId);
        const budgetCategory = this.budgetCategoryList[budgetCategoryIndex];
        const index = budgetCategory.paymentList.findIndex(item => item.id == id);
        budgetCategory.paidAmount -= budgetCategory.paymentList[index].amount;
        this.paidAmount -= budgetCategory.paymentList[index].amount;
        budgetCategory.paymentList.splice(index, 1);
      }
    });
  }

  openAddPaymentForm(content: TemplateRef<any>, budgetCategoryId: number) {
    this.newPayment.budgetCategoryId = budgetCategoryId;
    this.offcanvasService.open(content, { position: 'end' }).result.then(
      () => {
        this.newPayment = {} as Payment;
      },
      () => {
        this.newPayment = {} as Payment;
      }
    );
  }
}
