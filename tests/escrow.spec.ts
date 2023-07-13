import {get_account, reset_experiment, set_quiet, set_mockup, set_mockup_now, expect_to_fail} from "@completium/experiment-ts";

import { escrow } from './binding/escrow'
import { Tez } from "@completium/archetype-ts-types";

const assert = require('assert')

/* Accounts ---------------------------------------------------------------- */

const alice = get_account('alice');
const bob = get_account('bob');

/* Initialisation ---------------------------------------------------------- */

describe('[ESCROW] Initialisation', async () => {
  it('Reset experiment', async () => {
    await reset_experiment({
      account: 'alice',
      endpoint: 'mockup',
      quiet: true,
    });
  });
  it('set_mockup', async () => {
    set_mockup()
    // await mockup_init()
  });
  it('set_mockup_now', async () => {
    set_mockup_now(new Date(Date.now()))
  });
})

/* Scenario ---------------------------------------------------------------- */

describe('[ESCROW] Contract deployment', async () => {
  it('Deploy test_binding', async () => {
    await escrow.deploy(alice.get_address(), bob.get_address(), {})
  });
})

describe('[ESCROW] Call entries', async () => {
  it("deposit", async () => {
    // La balance du contrat est initialement bien à zéro
    const balance_before = await escrow.get_balance()
    assert(balance_before.equals(new Tez(0)))
    
    // Seul le propriétaire est autorisé à déposer des fonds
    await expect_to_fail(async () => {
      await escrow.deposit({ as : bob })
    }, escrow.errors.INVALID_CALLER)

    // Le point d'entré "deposit" oblige à déposer un montant supérieur à zéro
    await expect_to_fail(async () => {
      await escrow.deposit({ as : alice, amount: new Tez(0) })
    }, escrow.errors.r0)

    // Dépôt de 50tz par le propriétaire
    await escrow.deposit({ as : alice, amount: new Tez(50) })

    // La balance du contrat a changé et contient 50tz
    const balance_after = await escrow.get_balance()
    assert(new Tez(50).equals(balance_after))
  })
  it("release", async () => {
    const initial_beneficiary_balance = await bob.get_balance();
    const contract_balance_before_release = await escrow.get_balance()

    // Seul le propriétaire est autorisé à retirer les fonds du contrat
    await expect_to_fail(async () => {
      await escrow.release({ as : bob })
    }, escrow.errors.INVALID_CALLER)

    // Retrait des fonds par le propriétaire
    await escrow.release({ as : alice})

    // Le contrat n'a plus de fonds
    const contract_balance = await escrow.get_balance()
    assert(contract_balance.equals(new Tez(0)));

    // Le bénéficiaire a bien reçu les fonds
    const beneficiary_balance = await bob.get_balance()
    const tez_amount_to_test = contract_balance_before_release.plus(initial_beneficiary_balance);
    assert(tez_amount_to_test.equals(beneficiary_balance))
  })
})