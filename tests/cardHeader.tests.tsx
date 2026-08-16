/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CardHeader } from "../src/components/common/CardHeader";

const FLOWCHART_ID = "6ad0fa11-2db6-51ab-8ff9-638ed36d60b2";

const render = (props: Record<string, unknown> = {}) =>
    renderToStaticMarkup(
        <CardHeader
            title="pw_scf"
            subheader={FLOWCHART_ID}
            contentToCopy={FLOWCHART_ID}
            avatarIndex="01"
            status="idle"
            badgeColor="default"
            {...props}
        />,
    );

test("the flowchart id is not rendered by default", () => {
    // A card in the designer is read by someone building a workflow; the UUID is
    // addressed to whoever is debugging, and it cost a line on every card.
    const markup = render();
    assert.ok(!markup.includes(FLOWCHART_ID), "expected no flowchart id in the default render");
});

test("the flowchart id appears when the host asks for developer info", () => {
    const markup = render({ showDeveloperInfo: true });
    assert.ok(markup.includes(FLOWCHART_ID), "expected the flowchart id to be shown");
});

test("status is not rendered by default", () => {
    // Every unit reports "idle" in the designer, where nothing has run.
    const markup = render();
    assert.ok(!/\bIdle\b/.test(markup), "expected no status badge or title in the default render");
});

test("status is rendered where it means something", () => {
    const markup = render({ showStatus: true, status: "active", badgeColor: "warning" });
    assert.ok(/\bActive\b/.test(markup), "expected the status to be shown when asked for");
});

test("the title is always rendered, in both modes", () => {
    // Guard against hiding the thing the card is actually for.
    assert.ok(render().includes("pw_scf"));
    assert.ok(render({ showDeveloperInfo: true, showStatus: true }).includes("pw_scf"));
});

test("hiding the id leaves no empty subheader behind", () => {
    // The id row is the only thing in the subheader; dropping the text but keeping
    // the row would leave a blank line and the copy button under every title.
    const markup = render();
    assert.ok(!markup.includes("MuiCardHeader-subheader"), "expected no subheader element at all");
});
