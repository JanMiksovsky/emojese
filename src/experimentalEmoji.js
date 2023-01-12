// Define custom images that should be used for specific emoji sequences.

const origin = window.location.origin;
const imageFolder =
  origin === "http://localhost" || origin.includes(".local")
    ? "static/experimental"
    : "experimental";

// This should be sorted from longest keys to shortest.
export default {
  // 3 characters
  "[😀]": `<img src="${imageFolder}/noun_mood_1415339.svg">`,
  "|🛞|": `<img src="${imageFolder}/noun_Road_1141292.svg">`,
  "⇥⇤📕": `<img src="${imageFolder}/noun_magazine_15905.svg">`,
  "⟨👥⟩": `<img src="${imageFolder}/noun_team_3240256.svg">`,
  "🍴−🔪": `<img src="${imageFolder}/noun_fork_1819231.svg">`,
  "🍽−🍴": `<img src="${imageFolder}/noun_Plate_1580290.svg">`,
  "💵↹⬚": `<img src="${imageFolder}/noun_buy_1382663.svg">`,
  "📄☐☑": `<img src="${imageFolder}/noun_test_247442.svg">`,
  "🚫💧~": `<img src="${imageFolder}/noun_Dry_3478019.svg">`,
  "🚫🧼~": `<img src="${imageFolder}/noun_dirty_2406754.svg">`,
  "🟫🌍∯": `<img src="${imageFolder}/noun-dirt-113123.svg">`,
  "🦵⚽️⟿": `<img src="${imageFolder}/noun_kick_2815113.svg">`,

  // 2 characters
  "⓻☀️": `<img src="${imageFolder}/noun_week_247256.svg">`,
  "┳┳": `<img src="${imageFolder}/noun_Table_3108110.svg">`,
  "◻️🍯": `<img src="${imageFolder}/noun_sugar_2913365.svg">`,
  "⚾⟿": `<img src="${imageFolder}/noun_Throw_2012636.svg">`,
  "⛺🏕️": `<img src="${imageFolder}/noun_far_3014025.svg">`,
  "✋◔": `<img src="${imageFolder}/noun_finger_2645941.svg">`,
  "⥁☀️": `<img src="${imageFolder}/noun_year_2612190.svg">`,
  "🌱🌳": `<img src="${imageFolder}/noun_growth_3087400.svg">`,
  "🍳◱": `<img src="${imageFolder}/noun_Kitchen_3140502.svg">`,
  "🍽️😋": `<img src="${imageFolder}/noun_Apple Bite_1305039.svg">`,
  "🎓↤": `<img src="${imageFolder}/noun_learn_483403.svg">`,
  "🎭📍": `<img src="${imageFolder}/noun_Theater_145066.svg">`,
  "🏋️~": `<img src="${imageFolder}/noun_heavy_609607.svg">`,
  "🏢◱": `<img src="${imageFolder}/noun_Apartment_697664.svg" >`,
  "🐇⟿": `<img src="${imageFolder}/noun_jumping_1692169.svg">`,
  "🐘~": `<img src="${imageFolder}/noun-bigger-2819136.svg">`,
  "🐿️~": `<img src="${imageFolder}/noun_ready_1823361.svg">`,
  "👇👇": `<img src="${imageFolder}/noun_together_1742410.svg">`,
  "💇‍♀️🧪": `<img src="${imageFolder}/noun_hair_2058198.svg">`,
  "💡⚙️": `<img src="${imageFolder}/noun_lamp_192630.svg">`,
  "💧𐤛": `<img src="${imageFolder}/noun_river_2025745.svg">`,
  "💧🔲": `<img src="${imageFolder}/noun_Pool_3417915.svg">`,
  "📖⟿": `<img src="${imageFolder}/noun_read_2008322.svg">`,
  "📦⬇️": `<img src="${imageFolder}/noun_Put In Package_1726694.svg">`,
  "🚫🧩": `<img src="${imageFolder}/noun_easy_3428320.svg">`,
  "🛌💭": `<img src="${imageFolder}/noun_dreaming_2071010.svg">`,
  "🛏◱": `<img src="${imageFolder}/noun_bedroom_1122147.svg" >`,
  "🛠️📍": `<img src="${imageFolder}/noun_Office_26565.svg">`,
  "🟩🌾": `<img src="${imageFolder}/noun_grass_2939117.svg">`,
  "🤏🏙️": `<img src="${imageFolder}/noun_Town_1367604.svg">`,
  "🥛⟿": `<img src="${imageFolder}/noun_drinking_154888.svg">`,
  "🥡📍": `<img src="${imageFolder}/noun_Restaurant_2662746.svg">`,
  "🦵⏀": `<img src="${imageFolder}/noun_knee_67788.svg">`,
  "🧑‍🌾📍": `<img src="${imageFolder}/noun_Farm_557239.svg">`,
  "🧩~": `<img src="${imageFolder}/noun_tired_1749591.svg">`,
  "🧱‖": `<img src="${imageFolder}/noun_wall_3210004.svg">`,
  "🪨~": `<img src="${imageFolder}/noun_dumb_108112.svg">`,
  "🪴🥚": `<img src="${imageFolder}/noun_seeding_3541933.svg">`,

  // 1 characters
  "↤": `<img src="${imageFolder}/noun_get_1899024.svg">`,
  "↦": `<img src="${imageFolder}/noun_give_1899006.svg">`,
  "⇲": `<img src="${imageFolder}/noun_inside_2836351.svg">`,
  "⌥": `<img src="${imageFolder}/noun_choose_3651302.svg">`,
  "◐": `<img src="${imageFolder}/noun_Behind_984396.svg" >`,
  "◑": `<img src="${imageFolder}/noun_ahead_984397.svg">`,
  "◒": `<img src="${imageFolder}/noun_below_2900924.svg" >`,
  "◓": `<img src="${imageFolder}/noun_over_2900915.svg" >`,
  "◠": `<img src="${imageFolder}/noun_above_967196.svg">`,
  "◡": `<img src="${imageFolder}/noun_bottom_967199.svg" >`,
  "⛏️": `<img src="${imageFolder}/noun_dig_2981747.svg">`,
  "⛓️": `<img src="${imageFolder}/noun_pull_3117274.svg">`,
  "🍁": `<img src="${imageFolder}/noun_falling_1887964.svg">`,
  "🎒": `<img src="${imageFolder}/noun_carry_2696191.svg" >`,
  "🎓": `<img src="${imageFolder}/noun-knowledge-2018786.svg">`,
  "🏬": `<img src="${imageFolder}/noun_Store_1938270.svg">`,
  "👂": `<img src="${imageFolder}/noun_hear_1512143.svg">`,
  "👇": `<img src="${imageFolder}/personPointingAtSelf.png" >`,
  "👐": `<img src="${imageFolder}/noun_Pushing_3194184.svg">`,
  "👣": `<img src="${imageFolder}/noun_path_1925573.svg">`,
  "💁": `<img src="${imageFolder}/noun_own_3067162.svg">`,
  "🕸️": `<img src="${imageFolder}/noun_receive_2012635.svg">`,
  "🥃": `<img src="${imageFolder}/noun_Cup_60143.svg">`,
  "🦝": `<img src="${imageFolder}/noun_stealing money_657568.svg">`,
  "🦮": `<img src="${imageFolder}/noun_lead_2404496.svg">`,
  "🧑‍⚕️": `<img src="${imageFolder}/noun_caring_169351.svg">`,
  "🚑": `<img src="${imageFolder}/noun_help_3378626.svg">`,
  // "☀️": `<img src="${imageFolder}/noun_day and night_33746.svg">`,
};
