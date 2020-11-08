<template>
  <div id="app">
    <md-toolbar class="md-primary">
        <h1 class="md-title">Adulting</h1>
    </md-toolbar>
    <form novalidate class="md-layout" @submit.prevent="validateExpense">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">New Expense</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('description')">
                <label for="description">Description</label>
                <md-input name="description" id="description" autocomplete="given-name" v-model="form.description" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.description.required">The description name is required</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('price')">
                <label for="price">Price</label>
                <span class="md-prefix">£</span>
                <md-input type="number" name="price" id="price" autocomplete="family-name" v-model="form.price" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.price.required">The price is required</span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="category">Category</label>
                <md-select name="category" id="category" v-model="form.category" md-dense :disabled="sending">
                  <md-option></md-option>
                  <md-option value="12">Groceries</md-option>
                  <md-option value="23">Entertainment</md-option>
                  <md-option value="13">Dining Out</md-option>
                  <md-option value="38">Liquor</md-option>
                </md-select>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field >
                <label for="date">Date</label>
                <md-datepicker v-model="form.selectedDate" md-immediately />
              </md-field>
            </div>
          </div>

        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create Expense</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="expenseSaved">The expense {{ lastExpense }} was saved with success!</md-snackbar>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required
} from 'vuelidate/lib/validators'

export default {
  name: 'App',
  mixins: [validationMixin],
  data: () => ({
    form: {
        description: null,
        price: null,
        category: null,
        selectedDate: null
      },
      expenseSaved: false,
      sending: false,
      lastExpense: null
  }),
  validations: {
      form: {
        description: {
          required
        },
        price: {
          required
        }
      }
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearForm () {
        this.$v.$reset()
        this.form.description = null
        this.form.price = null
        this.form.category = null
        this.form.selectedDate = new Date()
      },
      saveExpense () {
        this.sending = true

        // Instead of this timeout, here you can call your API
        window.setTimeout(() => {
          // this.lastUser = `${this.form.firstName} ${this.form.lastName}`
          console.log(this.form);
          this.userSaved = true
          this.sending = false
          this.clearForm()
        }, 1500)
      },
      validateExpense () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.saveExpense()
        }
      }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
