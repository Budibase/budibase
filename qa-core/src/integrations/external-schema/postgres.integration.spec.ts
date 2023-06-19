import { GenericContainer } from "testcontainers"
import postgres from "../../../../packages/server/src/integrations/postgres"

jest.unmock("pg")

describe("getExternalSchema", () => {
  describe("postgres", () => {
    let host: string
    let port: number
    let config: any

    beforeAll(async () => {
      const container = await new GenericContainer("postgres")
        .withExposedPorts(5432)
        .withEnv("POSTGRES_PASSWORD", "password")
        .start()

      host = container.getContainerIpAddress()
      port = container.getMappedPort(5432)

      config = {
        host,
        port,
        database: "postgres",
        user: "postgres",
        password: "password",
        schema: "public",
        ssl: false,
        rejectUnauthorized: false,
      }
    })

    it("can export an empty database", async () => {
      const integration = new postgres.integration(config)
      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`
        "--
        -- PostgreSQL database dump
        --

        -- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
        -- Dumped by pg_dump version 15.3

        SET statement_timeout = 0;
        SET lock_timeout = 0;
        SET idle_in_transaction_session_timeout = 0;
        SET client_encoding = 'UTF8';
        SET standard_conforming_strings = on;
        SELECT pg_catalog.set_config('search_path', '', false);
        SET check_function_bodies = false;
        SET xmloption = content;
        SET client_min_messages = warning;
        SET row_security = off;

        --
        -- PostgreSQL database dump complete
        --

        "
      `)
    })
  })
})
