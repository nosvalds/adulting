<template>
  <div id="app">
    <md-toolbar class="md-primary">
      <h1 class="md-title">Adulting</h1>
      <p class="md-body-1">v{{ version }}</p>
      <md-avatar v-if="userInfo">
        <img :src="this.userInfo.picture.small" alt="Splitwise user Avatar" />
      </md-avatar>
      <h3 v-if="userInfo">{{ this.userInfo.first_name }}</h3>
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
              <md-autocomplete
                name="description"
                id="description"
                :class="getValidationClass('description')"
                :md-options="commonDescriptions"
                v-model="form.description"
                :disabled="sending"
                ><label for="description">Description</label>
                <span class="md-error" v-if="!$v.form.description.required"
                  >The description name is required</span
                >
              </md-autocomplete>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('price')">
                <span class="md-prefix">C$</span>
                <label for="price">Price</label>
                <md-input
                  type="number"
                  name="price"
                  id="price"
                  v-model="form.price"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.price.required"
                  >The price is required</span
                >
                <span
                  class="md-error"
                  v-if="$v.form.price.required && !$v.form.price.money"
                  >Incorrect price format</span
                >
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-xsmall-size-100">
              <md-field :class="getValidationClass('category')">
                <div>
                  <md-radio class="radio" v-model="form.category" value="12"
                    >Groceries</md-radio
                  >
                  <md-radio class="radio" v-model="form.category" value="23"
                    >Entertainment</md-radio
                  >
                  <md-radio class="radio" v-model="form.category" value="13"
                    >Dining Out</md-radio
                  >
                  <md-radio class="radio" v-model="form.category" value="38"
                    >Liquor</md-radio
                  >
                </div>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('selectedDate')">
                <label for="date">Date</label>
                <md-datepicker v-model="form.selectedDate" />
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="104"
          height="143"
          viewBox="0 0 104 143"
        >
          <g fill="none" fill-rule="evenodd">
            <path
              fill="#1CC29F"
              d="M39.209 64.715l12.402-6.866L0 29.275v28.218c3.868-1.999 8.74-3.04 14.32-3.04 12.149 0 19.837 4.948 24.889 10.262M16.438 104.1c5.17 0 9.067-1.462 9.067-5.2 0-3.82-5-5.282-11.185-6.745C9.715 91.025 4.43 89.89 0 87.75V95c3.729 5.77 9.915 9.1 16.438 9.1"
            />
            <path fill="#52595F" d="M103.221 86.422V29.276l-51.61 28.573z" />
            <path
              fill="#ACE4D6"
              d="M103.22 29.276L51.61.702 0 29.276l51.61 28.572z"
            />
            <path
              fill="#373B3F"
              d="M51.61 57.848l-12.402 6.866-13.293 7.361c-3.397-2.59-7.717-4.459-11.68-4.459-4.83 0-7.287 1.543-7.287 4.388 0 3.291 3.361 4.86 8.02 6.131.977.267 2.008.522 3.08.776 10.254 2.356 23.98 5.363 23.98 18.85 0 2.832-.62 5.654-1.983 8.229h63.175V86.422L51.61 57.848z"
            />
            <path
              fill="#FFF"
              d="M18.048 78.91a93.018 93.018 0 0 1-3.08-.775c-4.659-1.271-8.02-2.84-8.02-6.13 0-2.846 2.457-4.388 7.288-4.388 3.962 0 8.282 1.868 11.679 4.458l13.293-7.36C34.156 59.4 26.468 54.453 14.32 54.453c-5.58 0-10.452 1.04-14.32 3.04v30.256c4.429 2.14 9.715 3.275 14.32 4.406 6.185 1.463 11.185 2.925 11.185 6.745 0 3.738-3.898 5.2-9.067 5.2-6.524 0-12.71-3.331-16.438-9.1v10.99h40.045c1.362-2.575 1.984-5.397 1.984-8.229 0-13.487-13.727-16.495-23.98-18.85"
            />
            <g fill="#373B3F">
              <path
                d="M2.723 138.233c-1.13-.328-2.038-.754-2.723-1.28l1.204-2.667c.655.48 1.435.867 2.34 1.159a8.775 8.775 0 0 0 2.71.437c1.008 0 1.75-.15 2.231-.448.482-.299.722-.697.722-1.192 0-.365-.142-.668-.426-.908-.284-.24-.649-.433-1.093-.58a22.213 22.213 0 0 0-1.805-.48c-1.166-.277-2.121-.554-2.865-.832a4.666 4.666 0 0 1-1.914-1.334c-.532-.612-.797-1.429-.797-2.449 0-.89.24-1.695.721-2.417.48-.721 1.206-1.293 2.177-1.716.968-.423 2.154-.635 3.554-.635.976 0 1.93.117 2.864.35.933.234 1.75.569 2.45 1.006l-1.094 2.69c-1.414-.801-2.829-1.203-4.243-1.203-.992 0-1.724.161-2.198.482-.474.32-.71.743-.71 1.268s.273.915.82 1.17c.547.255 1.381.507 2.504.755 1.166.277 2.121.554 2.865.83.743.278 1.38.715 1.913 1.313.532.598.8 1.407.8 2.427 0 .875-.245 1.673-.734 2.395s-1.22 1.294-2.198 1.717c-.977.423-2.165.634-3.565.634-1.21 0-2.38-.164-3.51-.492zm20.405-3.28c.562-.59.843-1.381.843-2.373 0-.992-.281-1.783-.843-2.373-.56-.59-1.28-.886-2.154-.886-.874 0-1.593.295-2.154.886-.561.59-.842 1.381-.842 2.373 0 .992.28 1.782.842 2.373.56.59 1.28.885 2.154.885.875 0 1.594-.295 2.154-.885zm1.422-7.677c.896.503 1.6 1.21 2.11 2.122.511.911.766 1.972.766 3.182s-.255 2.27-.765 3.181a5.425 5.425 0 0 1-2.111 2.122c-.897.503-1.892.755-2.985.755-1.501 0-2.683-.474-3.544-1.422v5.49H14.61v-16.01h3.259v1.357c.846-1.02 2.077-1.531 3.696-1.531 1.093 0 2.088.251 2.985.754zm5.15 11.187v-16.228h3.411v16.228H29.7zm6.582 0v-11.766h3.412v11.766h-3.412zm.175-13.953a1.775 1.775 0 0 1-.59-1.357c0-.539.197-.99.59-1.356.394-.364.905-.546 1.532-.546.626 0 1.137.175 1.53.525.394.35.59.787.59 1.312 0 .568-.196 1.04-.59 1.41-.393.372-.904.559-1.53.559-.627 0-1.138-.183-1.532-.547zm13.997 13.384c-.335.248-.746.434-1.236.558a6.289 6.289 0 0 1-1.542.186c-1.399 0-2.481-.357-3.247-1.072-.766-.714-1.148-1.764-1.148-3.15v-5.095h-1.815v-2.624h1.815v-2.603h3.412v2.603h2.93v2.624h-2.93v5.052c0 .496.127.879.382 1.148.255.27.616.405 1.083.405.54 0 .998-.146 1.377-.438l.919 2.406zm20.95-11.197l-4.265 11.766h-3.28l-2.647-7.305-2.733 7.305h-3.28l-4.243-11.766h3.215l2.778 7.96 2.886-7.96h2.886l2.8 7.96 2.865-7.96h3.018zm1.597 11.766v-11.766h3.412v11.766H73zm.175-13.953a1.775 1.775 0 0 1-.59-1.357c0-.539.197-.99.59-1.356.394-.364.904-.546 1.531-.546.627 0 1.138.175 1.53.525.394.35.591.787.591 1.312 0 .568-.197 1.04-.59 1.41-.393.372-.904.559-1.53.559-.628 0-1.138-.183-1.532-.547zm7.5 13.767c-.933-.24-1.676-.543-2.23-.908l1.137-2.45c.526.337 1.16.61 1.903.82a7.949 7.949 0 0 0 2.187.318c1.444 0 2.166-.357 2.166-1.072 0-.335-.198-.575-.59-.721-.395-.146-1-.27-1.816-.373-.962-.145-1.758-.313-2.385-.502a3.692 3.692 0 0 1-1.628-1.006c-.46-.481-.69-1.166-.69-2.056 0-.743.216-1.403.646-1.98.43-.575 1.057-1.023 1.88-1.344.824-.32 1.798-.481 2.92-.481.83 0 1.659.091 2.483.273.823.183 1.504.434 2.044.755l-1.136 2.427a6.798 6.798 0 0 0-3.391-.875c-.73 0-1.276.102-1.64.307-.365.204-.547.466-.547.787 0 .365.197.62.59.765.395.146 1.022.285 1.881.416.962.16 1.75.331 2.362.514a3.542 3.542 0 0 1 1.597.995c.451.481.678 1.152.678 2.012a3.11 3.11 0 0 1-.656 1.946c-.438.569-1.075 1.01-1.914 1.324-.839.313-1.833.47-2.985.47-.977 0-1.932-.121-2.865-.361zm13.998-8.519c-.525.438-.845 1.036-.962 1.794h5.796c-.118-.744-.438-1.338-.963-1.783-.525-.444-1.167-.667-1.925-.667-.772 0-1.421.22-1.946.656zm7.983 3.784h-8.902c.161.73.54 1.305 1.137 1.728.598.423 1.342.634 2.231.634.613 0 1.156-.091 1.63-.273.474-.182.915-.47 1.323-.864l1.815 1.968c-1.108 1.268-2.726 1.903-4.856 1.903-1.326 0-2.5-.259-3.52-.777-1.021-.517-1.808-1.235-2.362-2.154-.555-.918-.831-1.96-.831-3.127 0-1.152.273-2.191.82-3.117a5.745 5.745 0 0 1 2.253-2.165c.955-.517 2.022-.776 3.204-.776 1.15 0 2.194.247 3.127.743a5.442 5.442 0 0 1 2.198 2.133c.532.925.798 2 .798 3.225 0 .044-.021.35-.065.919z"
              />
            </g>
          </g>
        </svg>
      </md-card-media>
      <md-card-content>
        <md-button class="md-raised md-accent" @click.prevent="connect"
          >Connect to Splitwise</md-button
        >
      </md-card-content>
    </md-card>
    <div v-if="arePastExpenses">
      <h3>Saved Expenses</h3>
      <md-table>
        <md-table-row>
          <md-table-head>Date</md-table-head>
          <md-table-head>Category</md-table-head>
          <md-table-head>Description</md-table-head>
          <md-table-head>Cost</md-table-head>
        </md-table-row>
        <md-table-row v-for="expense in pastExpenses" :key="expense.id">
          <md-table-cell>{{
            new Date(expense.date).toLocaleDateString()
          }}</md-table-cell>
          <md-table-cell>{{ expense.category.name }}</md-table-cell>
          <md-table-cell>{{ expense.description }}</md-table-cell>
          <md-table-cell
            >{{ expense.cost }} {{ expense.currency_code }}</md-table-cell
          >
        </md-table-row>
      </md-table>
    </div>
    <div v-if="budgets">
      <h3>Budgets for {{ this.date.month }}/{{ this.date.year }}</h3>
      <md-table md-card>
        <md-table-row>
          <md-table-head>Category</md-table-head>
          <md-table-head>Budget</md-table-head>
          <md-table-head>Spend</md-table-head>
          <md-table-head>Remaining</md-table-head>
        </md-table-row>
        <md-table-row v-for="budgetItem in budgets" :key="budgetItem.category">
          <md-table-cell>{{ budgetItem.category }}</md-table-cell>
          <md-table-cell>{{ budgetItem.budget }}</md-table-cell>
          <md-table-cell>{{ budgetItem.spend }}</md-table-cell>
          <md-table-cell>{{ budgetItem.remaining }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Pizzly from "pizzly-js";
import categoryTotals from "./utils/expensesData";
import { version } from "../package.json";

const pizzly = new Pizzly({ host: process.env.VUE_APP_PIZZLY_URL }); // Initialize Pizzly
const splitwise = pizzly.integration("splitwise");

export default {
  name: "App",
  mixins: [validationMixin],
  data: () => {
    let now = new Date();
    const [month, date, year] = new Date()
      .toLocaleDateString("en-US")
      .split("/");
    return {
      version: version,
      date: {
        month,
        date,
        year,
      },
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
      pastExpenses: [],
      budgets: null,
      commonDescriptions: ["IGA", "Provigo", "SAQ"],
    };
  },
  computed: {
    arePastExpenses: function() {
      return this.pastExpenses.length > 0;
    },
  },
  validations: {
    form: {
      description: {
        required,
      },
      price: {
        required,
      },
      category: {
        required,
      },
      selectedDate: {
        required,
      },
    },
  },
  methods: {
    connect() {
      splitwise
        .connect() // connect
        .then(this.connectSuccess)
        .then(this.getUserData)
        .then(this.getMonthlyExpenses)
        .catch(this.connectError);
    },
    connectSuccess(data) {
      // On success, update user object
      this.userToken = data.authId;
    },
    getUserData() {
      splitwise
        .auth(this.userToken)
        .get("/get_current_user")
        .then((response) => response.json())
        .then(async (data) => {
          this.userInfo = data.user;
        });
    },
    getMonthlyExpenses() {
      const now = new Date();
      const month = now.getMonth();
      now.setDate(1);
      now.setUTCHours(0);
      now.setUTCMinutes(0);
      now.setUTCSeconds(0);
      splitwise
        .auth(this.userToken)
        .get(
          `/get_expenses?visible=true&order=date&group_id=11912464&limit=100`
        )
        .then((response) => response.json())
        .then(async (data) => {
          this.budgets = categoryTotals(data, month);
        });
    },
    connectError(err) {
      console.error(err);
      alert("Something went wrong. Ask Niki for help.");
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

      let total = String(Number.parseFloat(this.form.price).toFixed(2));

      let isOdd = (Number.parseFloat(total) * 100).toFixed(0) % 2 === 1;

      let share0;
      let share1;
      if (isOdd) {
        share0 = String(((total * 100 + 1) / 2 / 100).toFixed(2));
        share1 = String(((total * 100 - 1) / 2 / 100).toFixed(2));
      } else {
        share0 = String((total / 2).toFixed(2));
        share1 = String((total / 2).toFixed(2));
      }

      let data = {
        cost: total,
        currency_code: "CAD",
        description: this.form.description,
        date: this.form.selectedDate.toISOString(),
        group_id: "11912464", // adulting
        users__0__user_id: "906803", // niki
        users__0__paid_share: share0,
        users__0__owed_share: share0,
        users__1__user_id: "6811318", // heather
        users__1__paid_share: share1,
        users__1__owed_share: share1,
        category_id: this.form.category,
        creation_method: "equal",
      };
      // Create Expense through API
      splitwise
        .auth(this.userToken)
        .post("/create_expense", {
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => response.json())
        .then((data) => {
          if (Object.keys(data.errors).length > 0) {
            console.error(data.errors.base);
            alert(
              "Something went wrong. Ask Niki for help. " + data.errors.base
            );
            this.expenseSaved = false;
            this.sending = false;
          } else {
            this.pastExpenses = [...this.pastExpenses].concat(data.expenses);

            // add to budget table
            this.budgets = this.budgets.map((category) => {
              if (this.form.category == category.id) {
                return {
                  ...category,
                  spend: (
                    Number.parseFloat(category.spend) + Number.parseFloat(total)
                  ).toFixed(2),
                  remaining: (
                    Number.parseFloat(category.remaining) -
                    Number.parseFloat(total)
                  ).toFixed(2),
                };
              } else {
                return { ...category };
              }
            });
            this.expenseSaved = true;
            this.sending = false;
            this.clearForm();
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Something went wrong. Ask Niki for help. " + error);
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
.radio {
  padding: 1rem;
  margin-bottom: 1rem;
}
.md-body-1 {
  margin-left: 1rem;
}
</style>
