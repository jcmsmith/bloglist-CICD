describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "/api/testing/reset")
    const user = {
      name: "Admin",
      username: "admin",
      password: "mrbrown"
    }

    cy.request("POST", "/api/users", user)
    cy.visit("/")
  })

  describe("Login", function() {
    it("succeeds with correct credentials", function() {
      cy.get("[data-cy=username-input]")
        .type("admin")

      cy.get("[data-cy=password-input]")
        .type("mrbrown")

      cy.get("[data-cy=login-button]")
        .click()

      cy.get("[data-cy=loggedin-as-msg]")
    })

    it("fails with incorrect credentials", function() {
      cy.get("[data-cy=username-input]")
        .type("wrongname")

      cy.get("[data-cy=password-input]")
        .type("wrongpass")

      cy.get("[data-cy=login-button]")
        .click()

      cy.get("[data-cy=display-message]")
        .should("be.visible")
        .find("div")
        .should("have.css", "color", "rgb(255, 0, 0)")
    })
  })

  describe("When logged in", function() {
    beforeEach(function() {
      cy.login({ username: "admin", password: "mrbrown" })
    })

    it("a new blog can be created", function() {
      cy
        .get("[data-cy=togglevis-show-button]")
        .click()

      cy
        .get("[data-cy=newblog-titleinput]")
        .type("blogtitlehere")

      cy
        .get("[data-cy=newblog-authorinput]")
        .type("authorhere")

      cy
        .get("[data-cy=newblog-urlinput]")
        .type("url.com/xyz")

      cy
        .get("[data-cy=newblog-save-button]")
        .click()

      cy
        .get("[data-cy=blog-title-minimal]")
        .contains("blogtitlehere")
    })

    describe("and blogs already exist", function() {
      beforeEach(function() {
        cy.createBlog({
          title: "A New Blog",
          author: "Jane Doe",
          url: "website.xyz"
        })

        cy.createBlog({
          title: "Another One",
          author: "Jack Jackson",
          url: "somewhere.com/something"
        })

        cy.createBlog({
          title: "A Third One",
          author: "Human Person",
          url: "place.net"
        })
      })

      it("an existing blog can be liked", function() {
        cy
          .get("[data-cy=blog-title-minimal]")
          .contains("A New Blog")
          .parent()
          .find("[data-cy=blog-showdetails-button]")
          .click()

        cy
          .get("[data-cy=blog-likes-label]")
          .contains("0")
          .find("[data-cy=blog-like-button]")
          .click()
          .parent()
          .contains("1")
      })

      it("the user can delete their own blogs", function() {
        cy
          .get("[data-cy=blog-minimal]")
          .as("blogs")
          .contains("A New Blog")
          .parent()
          .find("[data-cy=blog-delete-button-minimal]")
          .click()

        cy
          .get("@blogs")
          .should("have.length", 2)
      })

      it("blogs are ordered according to likes, descending", function() {
        cy
          .get("[data-cy=blog-minimal]")
          .eq(0)
          .find("[data-cy=blog-showdetails-button]")
          .click()

        cy
          .get("[data-cy=blog-minimal]")
          .eq(1)
          .find("[data-cy=blog-showdetails-button]")
          .click()

        cy
          .get("[data-cy=blog-minimal]")
          .eq(2)
          .find("[data-cy=blog-showdetails-button]")
          .click()

        cy
          .get("[data-cy=blog-expanded]")
          .eq(1)
          .find("[data-cy=blog-likes-label]")
          .contains("0")
          .find("[data-cy=blog-like-button]")
          .click()
          .parent()
          .contains("1")

        cy
          .get("[data-cy=blog-expanded]")
          .eq(2)
          .find("[data-cy=blog-likes-label]")
          .contains("0")
          .find("[data-cy=blog-like-button]")
          .click()
          .parent()
          .contains("1")
          .find("[data-cy=blog-like-button]")
          .click()
          .parent()
          .contains("2")

        cy
          .get("[data-cy=blog-expanded]")
          .eq(0)
          .find("[data-cy=blog-title-expanded]")
          .contains("A Third One")

        cy
          .get("[data-cy=blog-expanded]")
          .eq(1)
          .find("[data-cy=blog-title-expanded]")
          .contains("Another One")
      })
    })
  })
})