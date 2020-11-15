<template>
  <div id="app">
    <md-toolbar class="md-primary">
      <h1 class="md-title">Adulting</h1>
      <md-avatar v-if="userInfo">
        <img src="./assets/logo.png" alt="Avatar" />
      </md-avatar>
    </md-toolbar>
    <form
      v-if="userToken"
      novalidate
      class="md-layout"
      @submit.prevent="validateExpense"
    >
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">New Expense</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('description')">
                <label for="description">Description</label>
                <md-input
                  name="description"
                  id="description"
                  autocomplete="given-name"
                  v-model="form.description"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.description.required"
                  >The description name is required</span
                >
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('price')">
                <span class="md-prefix">£</span>
                <label for="price">Price</label>
                <md-input
                  type="number"
                  name="price"
                  id="price"
                  autocomplete="family-name"
                  v-model="form.price"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.price.required"
                  >The price is required</span
                >
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="category">Category</label>
                <md-select
                  name="category"
                  id="category"
                  v-model="form.category"
                  md-dense
                  :disabled="sending"
                >
                  <md-option></md-option>
                  <md-option value="12">Groceries</md-option>
                  <md-option value="23">Entertainment</md-option>
                  <md-option value="13">Dining Out</md-option>
                  <md-option value="38">Liquor</md-option>
                </md-select>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="date">Date</label>
                <md-datepicker v-model="form.selectedDate" md-immediately />
              </md-field>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending"
            >Create Expense</md-button
          >
        </md-card-actions>
      </md-card>

      <md-snackbar v-if="expenseSaved"
        >The expense was saved with success!</md-snackbar
      >
    </form>
    <md-card v-else>
      <md-card-media>
        <img
          src="http://dev.splitwise.com/images/logo.svg"
          alt="splitwise logo"
        />
      </md-card-media>
      <md-card-content>
        <md-button class="md-raised md-accent" @click.prevent="connect"
          >Connect to Splitwise</md-button
        >
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Pizzly from "pizzly-js";

const pizzly = new Pizzly({ host: "http://localhost:8080/" }); // Initialize Pizzly
const splitwise = pizzly.integration("splitwise"); // Replace with the API slugname

export default {
  name: "App",
  mixins: [validationMixin],
  data: () => {
    let now = new Date();
    return {
      userToken: null,
      userInfo: null,
      form: {
        description: null,
        price: null,
        category: null,
        selectedDate: now,
      },
      expenseSaved: false,
      sending: false,
      lastExpense: null,
    };
  },
  validations: {
    form: {
      description: {
        required,
      },
      price: {
        required,
      },
      category: {},
      selectedDate: {},
    },
  },
  methods: {
    connect() {
      console.log("Starting Connection");
      splitwise
        .connect() // connect
        .then(this.connectSuccess)
        .then(this.getUserData)
        .catch(this.connectError);
    },
    connectSuccess(data) {
      // On success, update user object
      this.userToken = data.authId;
      console.log("Logged in");
    },
    getUserData() {
      splitwise
        .auth(this.userToken)
        .get("/get_current_user")
        .then((data) => {
          console.log(data);
          this.userInfo = data;
        });
    },
    connectError(err) {
      console.error(err);
      alert("Something went wrong. Look at the logs.");
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      let now = new Date();
      this.$v.$reset();
      this.form.description = null;
      this.form.price = null;
      this.form.category = null;
      this.form.selectedDate = now;
    },
    saveExpense() {
      this.sending = true;

      let split = String(Number(this.form.price) / 2);

      let data = {
        cost: this.form.price,
        currency_code: "GBP",
        description: this.form.description,
        date: this.form.selectedDate.toISOString(),
        payment: false,
        group_id: 11912464, // adulting
        split_equally: true,
        users__0__user_id: 906803, // niki
        users__0__paid_share: split,
        users__0__owed_share: split,
        users__1__user_id: 6811318, // heather
        users__1__paid_share: split,
        users__1__owed_share: split,
        category_id: this.form.category,
      };
      console.log(data);
      // Call your API
      splitwise
        .auth(this.userToken)
        .post("/create_expense", { body: JSON.stringify(data) })
        .then((res) => {
          console.log(res.status);
          console.log(res.data);
          this.expenseSaved = true;
          this.sending = false;
          this.clearForm();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    validateExpense() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveExpense();
      }
    },
  },
};
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
