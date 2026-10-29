<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, Copy, Pencil } from "@lucide/vue";
import { VisuallyHidden } from "reka-ui";
import VButton from "../../components/ui/VButton.vue";
import VInput from "../../components/ui/VInput.vue";
import VDialog from "../../components/ui/dialog/VDialog.vue";
import {
  VDropdownMenu,
  VDropdownMenuTrigger,
  VDropdownMenuContent,
  VDropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import VTooltip from "../../components/ui/tooltip/VTooltip.vue";

const inputValue = ref("");
const buttonClicks = ref(0);
const loading = ref(false);
const dialogOpen = ref(false);
const customDialogOpen = ref(false);
const menuAction = ref("No action selected");
const tooltipClicks = ref(0);
const tooltipSides = ["top", "right", "bottom", "left"] as const;
</script>

<template>
  <div class="components-page mx-auto w-full max-w-240 px-6 py-10 sm:px-10">
    <h1 class="text-3xl font-semibold tracking-tight">Components</h1>
    <p class="mt-4 max-w-prose text-sm leading-relaxed text-secondary-foreground">
      A small collection of interactive building blocks for your application.
    </p>

    <section class="showcase-section" aria-labelledby="button-heading">
      <div class="section-heading">
        <div>
          <h2 id="button-heading">Button</h2>
        </div>
        <p>Actions with clear intent.</p>
      </div>
      <div class="showcase-card">
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Variants</h3>
            <p>Choose the emphasis that fits the action.</p>
          </div>
          <div class="examples">
            <VButton @click="buttonClicks++">Primary</VButton
            ><VButton variant="secondary" @click="buttonClicks++">Secondary</VButton
            ><VButton variant="outline" @click="buttonClicks++">Outline</VButton
            ><VButton variant="ghost" @click="buttonClicks++">Ghost</VButton
            ><VButton variant="danger" @click="buttonClicks++">Danger</VButton>
          </div>
        </div>
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Sizes</h3>
            <p>Three sizes for different contexts.</p>
          </div>
          <div class="examples">
            <VButton size="sm">Small</VButton><VButton size="md">Medium</VButton
            ><VButton size="lg">Large</VButton>
          </div>
        </div>
        <div class="showcase-row">
          <div class="row-heading">
            <h3>States</h3>
            <p>Hover or use Tab to see feedback.</p>
          </div>
          <div class="examples">
            <VButton disabled>Disabled</VButton><VButton :loading="loading">Saving</VButton
            ><VButton variant="outline" @click="loading = !loading">{{
              loading ? "Stop loading" : "Show loading"
            }}</VButton>
          </div>
        </div>
        <p class="showcase-note" aria-live="polite">Variant button clicks: {{ buttonClicks }}</p>
      </div>
    </section>

    <section class="showcase-section" aria-labelledby="input-heading">
      <div class="section-heading">
        <div>
          <h2 id="input-heading">Input</h2>
        </div>
        <p>Simple, accessible text entry.</p>
      </div>
      <div class="showcase-card">
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Text input</h3>
            <p>Type, select and copy text.</p>
          </div>
          <div class="input-example">
            <label for="component-input">Your name</label
            ><VInput
              id="component-input"
              v-model="inputValue"
              placeholder="Enter your name"
              autocomplete="off"
            />
            <p class="input-hint" aria-live="polite">Value: {{ inputValue || "—" }}</p>
          </div>
        </div>
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Sizes</h3>
            <p>Consistent at every scale.</p>
          </div>
          <div class="input-stack">
            <VInput size="sm" aria-label="Small input" placeholder="Small" /><VInput
              size="md"
              aria-label="Medium input"
              placeholder="Medium"
            /><VInput size="lg" aria-label="Large input" placeholder="Large" />
          </div>
        </div>
        <div class="showcase-row">
          <div class="row-heading">
            <h3>States</h3>
            <p>Disabled and invalid inputs.</p>
          </div>
          <div class="input-stack">
            <div>
              <label for="disabled-input">Disabled</label
              ><VInput id="disabled-input" disabled placeholder="Unavailable" />
            </div>
            <div>
              <label for="invalid-input">Email</label
              ><VInput
                id="invalid-input"
                invalid
                aria-describedby="input-error"
                placeholder="name@example.com"
              />
              <p id="input-error" class="input-error">Enter a valid email address.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="showcase-section" aria-labelledby="dialog-heading">
      <div class="section-heading">
        <div>
          <h2 id="dialog-heading">Dialog</h2>
        </div>
        <p>A focused space for a small task.</p>
      </div>
      <div class="showcase-card">
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Modal dialog</h3>
            <p>Open, then try Tab, Shift+Tab or Escape. Close returns focus to the trigger.</p>
          </div>
          <div class="examples">
            <VDialog
              v-model:open="dialogOpen"
              title="A little room to focus"
              description="Dialogs keep a short task in context without leaving the page."
            >
              <template #trigger><VButton>Open dialog</VButton></template>
              <p>
                This is the dialog body. You can select and copy this text. Click the overlay, press
                Escape or use either close button when you are done.
              </p>
              <template #footer="{ close }"
                ><VButton variant="outline" @click="close">Close</VButton></template
              >
            </VDialog>
            <VDialog v-model:open="customDialogOpen" :show-close="false">
              <template #trigger><VButton variant="outline">Custom content</VButton></template>
              <template #title><VisuallyHidden>Custom content preview</VisuallyHidden></template>
              <p>
                A custom body with a visually hidden accessible title and no description. The
                optional corner close button is hidden here.
              </p>
              <template #footer="{ close }"><VButton @click="close">Done</VButton></template>
            </VDialog>
          </div>
        </div>
      </div>
    </section>

    <section class="showcase-section" aria-labelledby="dropdown-heading">
      <div class="section-heading">
        <div>
          <h2 id="dropdown-heading">Dropdown menu</h2>
        </div>
        <p>Small, contextual actions.</p>
      </div>
      <div class="showcase-card">
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Actions menu</h3>
            <p>Hover an item, or open with Enter and navigate with the arrow keys.</p>
          </div>
          <div class="examples">
            <VDropdownMenu>
              <VDropdownMenuTrigger as-child
                ><VButton variant="outline"
                  ><span class="button-content"
                    >Open menu <ChevronDown :size="14" aria-hidden="true" /></span></VButton
              ></VDropdownMenuTrigger>
              <VDropdownMenuContent>
                <VDropdownMenuItem @select="menuAction = 'Preview selected'"
                  >Preview</VDropdownMenuItem
                >
                <VDropdownMenuItem @select="menuAction = 'Edit selected'"
                  ><Pencil :size="15" aria-hidden="true" /> Edit</VDropdownMenuItem
                >
                <VDropdownMenuItem @select="menuAction = 'Duplicate selected'"
                  ><Copy :size="15" aria-hidden="true" /> Duplicate</VDropdownMenuItem
                >
                <VDropdownMenuItem disabled @select="menuAction = 'Unavailable action selected'"
                  >Archive <span class="menu-hint">Unavailable</span></VDropdownMenuItem
                >
              </VDropdownMenuContent>
            </VDropdownMenu>
          </div>
        </div>
        <p class="showcase-note" aria-live="polite">{{ menuAction }}</p>
      </div>
    </section>

    <section class="showcase-section" aria-labelledby="tooltip-heading">
      <div class="section-heading">
        <div>
          <h2 id="tooltip-heading">Tooltip</h2>
        </div>
        <p>A little context, when needed.</p>
      </div>
      <div class="showcase-card">
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Hover &amp; focus</h3>
            <p>Hover for a hint, or use Tab to focus the button. Escape dismisses the hint.</p>
          </div>
          <div class="examples">
            <VTooltip content="The button still works as usual."
              ><VButton variant="outline" @click="tooltipClicks++"
                >Helpful action</VButton
              ></VTooltip
            >
          </div>
        </div>
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Placement</h3>
            <p>Four preferred sides. Hints adapt to the available space.</p>
          </div>
          <div class="examples">
            <VTooltip
              v-for="side in tooltipSides"
              :key="side"
              :side="side"
              :content="`A hint on the ${side}.`"
              ><VButton variant="outline">{{
                side[0].toUpperCase() + side.slice(1)
              }}</VButton></VTooltip
            >
          </div>
        </div>
        <div class="showcase-row">
          <div class="row-heading">
            <h3>Disabled tooltip</h3>
            <p>The hint is disabled; the trigger remains a regular button.</p>
          </div>
          <div class="examples">
            <VTooltip content="This hint is disabled." disabled
              ><VButton variant="outline" @click="tooltipClicks++">No tooltip</VButton></VTooltip
            >
          </div>
        </div>
        <p class="showcase-note" aria-live="polite">Tooltip button clicks: {{ tooltipClicks }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.components-page {
  padding-bottom: 64px;
}
.showcase-section {
  margin-top: 48px;
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.section-heading h2 {
  font-size: 20px;
  font-weight: 600;
}
.section-heading > p,
.row-heading p,
.input-hint,
.showcase-note {
  color: var(--vn-muted-foreground);
  font-size: 12px;
}
.showcase-card {
  border: 1px solid var(--vn-border);
  border-radius: 12px;
  background: var(--vn-surface);
}
.showcase-row {
  display: grid;
  grid-template-columns: minmax(140px, 190px) minmax(0, 1fr);
  gap: 24px;
  padding: 24px;
}
.showcase-row + .showcase-row {
  border-top: 1px solid var(--vn-border);
}
.row-heading h3 {
  font-size: 13px;
  font-weight: 600;
}
.row-heading p {
  margin-top: 5px;
  line-height: 1.5;
}
.examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.button-content {
  display: inline-flex;
  align-items: center;
  gap: var(--vn-space-2);
}
.menu-hint {
  margin-left: auto;
  color: var(--vn-muted-foreground);
  font-size: var(--vn-font-size-caption);
}
.showcase-note {
  border-top: 1px solid var(--vn-border);
  padding: 12px 24px;
}
.input-example,
.input-stack {
  width: 100%;
  max-width: 320px;
  min-width: 0;
}
.input-stack {
  display: grid;
  gap: 12px;
}
label {
  display: block;
  margin-bottom: 7px;
  color: var(--vn-secondary-foreground);
  font-size: 12px;
  font-weight: 500;
}
.input-hint,
.input-error {
  margin-top: 7px;
  overflow-wrap: anywhere;
}
.input-error {
  color: var(--vn-danger-foreground);
  font-size: 12px;
}
@media (max-width: 700px) {
  .showcase-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
  .section-heading {
    align-items: start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
