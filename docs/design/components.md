# Design: component inventory v1

Extracted from [super-good.pen](super-good.pen) for SIE-21, as the base for the Angular design system (SIE-62). Machine-readable form: [components.json](components.json). See [tokens.md](tokens.md) for the color/typography/spacing/radius tokens these components use. Re-export when the `.pen` file changes, same as [screens.md](screens.md).

## Components (127)

Every node marked `reusable` in `super-good.pen`, in file order (same order as [screens.md](screens.md)'s Components list, which has names only — this adds the structural properties). `Width`/`Height` are the component's own fixed size where set; a dash means the dimension is auto/content-sized. `Padding`/`Gap`/`Corner radius` are the raw values from the file: a single number (uniform), a list (e.g. vertical/horizontal, or top/right/bottom/left), or a `$--token` reference where the component already uses a named token from [tokens.md](tokens.md).

| # | Name | ID | Width | Height | Padding | Gap | Corner radius | Align | Justify |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Title Pill | `vLg10` | — | — | 9, 18 | 8 | $--radius-pill | center | — |
| 2 | Icon Button | `nhh4k` | 42 | 42 | — | — | 21 | center | center |
| 3 | Segmented Tabs | `yQ5PC` | 351 | — | 3 | 3 | $--radius-pill | — | — |
| 4 | Count Pill | `Rh2UY` | — | — | 8, 14 | 6 | $--radius-pill | center | — |
| 5 | Product Card | `Q7p9Fk` | 351 | — | 14 | 14 | $--radius-m | center | — |
| 6 | Amount Card | `i0u6l` | 351 | — | 16 | 10 | $--radius-m | — | — |
| 7 | Form Card | `hJmiJ` | 351 | — | 12 | 10 | $--radius-m | — | — |
| 8 | Product Row | `Z4vFv` | 351 | — | 8 | 8 | $--radius-m | center | — |
| 9 | History Row | `X8njZC` | 351 | — | 10, 8 | 10 | — | center | — |
| 10 | Detail Row | `hWl9O` | 351 | — | 10, 0 | — | — | center | space_between |
| 11 | Transcribed Row | `q0co6` | 329 | — | 8 | 10 | — | center | — |
| 12 | Input Field | `i5foHK` | 321 | — | — | 5 | — | — | — |
| 13 | Action Bar | `je4z6` | 345 | 68 | 12 | 8 | 36 | center | center |
| 14 | Primary Button | `slmk2` | 351 | 52 | — | — | $--radius-pill | center | center |
| 15 | Option Row Selected | `T5yJbn` | 351 | — | 12, 4 | 12 | — | center | — |
| 16 | Option Row | `rmq9J` | 351 | — | 12, 4 | 12 | — | center | — |
| 17 | Notification | `g0a0C0` | 359 | — | 14, 16 | 12 | 20 | center | — |
| 18 | Chip | `UGzOo` | — | — | 3, 10 | — | $--radius-pill | — | — |
| 19 | Search Bar | `Fhy0B` | 240 | 48 | 0, 16 | 10 | 24 | center | — |
| 20 | Filter Chip | `HUKbn` | — | 40 | 0, 16 | 8 | 24 | center | — |
| 21 | Filter Chip Active | `z9XdKy` | — | 40 | 0, 16 | — | 24 | center | center |
| 22 | Dropdown Chip | `qtvwX` | — | 40 | 0, 16 | 6 | 24 | center | — |
| 23 | Section Header | `D83ZYX` | 351 | — | — | — | — | center | space_between |
| 24 | Item Row | `CsrpK` | 335 | — | 8 | 8 | — | center | — |
| 25 | Hint Row | `u9lpo` | 335 | — | 0, 8, 8, 8 | 6 | — | center | — |
| 26 | Loading Row | `z4kd0` | 335 | — | 12, 8 | 8 | — | center | center |
| 27 | Swipe Row | `XGMHN` | 343 | 52 | — | — | — | — | — |
| 28 | Total Bar | `HBO89` | 345 | — | 4, 8 | — | — | center | space_between |
| 29 | List Card | `iWqAN` | 351 | — | 12, 8 | — | $--radius-m | — | — |
| 30 | Total Footer | `QyW3L` | 393 | 120 | 4, 24 | 8 | 20, 20, 0, 0 | center | center |
| 31 | Sticky Footer | `sXagw` | 393 | — | 16, 24, 36, 24 | 12 | 20, 20, 0, 0 | — | — |
| 32 | Summary Row | `GBckQ` | 345 | — | 0, 8 | — | — | center | space_between |
| 33 | Summary Footer | `kkoPz` | 393 | 180 | 4, 24 | 8 | 20, 20, 0, 0 | center | center |
| 34 | Customer Card | `nU08f` | 359 | 109 | — | — | $--radius-m | — | — |
| 35 | Dialog Button Secondary | `D3txqY` | 143 | — | 14, 20 | — | $--radius-pill | center | center |
| 36 | Dialog Button Destructive | `TSlxO` | 143 | — | 14, 20 | — | $--radius-pill | center | center |
| 37 | Dialog Button Primary | `uOZ9W` | 143 | — | 14, 20 | — | $--radius-pill | center | center |
| 38 | Filled Field | `oZPQx` | 297 | — | — | 6 | — | — | — |
| 39 | Mic Halo | `MKzdw` | 140 | 140 | — | — | 70 | center | center |
| 40 | Mic Halo Recording | `FOcxW` | 140 | 140 | — | — | 70 | center | center |
| 41 | Mic Halo Processing | `CWufR` | 140 | 140 | — | — | 70 | center | center |
| 42 | Recording Status | `U8m5IU` | — | — | — | 4 | — | center | — |
| 43 | Sheet Header | `lulH4` | 345 | — | — | — | — | center | space_between |
| 44 | Divider Row | `DyOf3` | 345 | — | — | 12 | — | center | — |
| 45 | Upload Button | `zHApj` | 345 | — | 14, 20 | 8 | $--radius-pill | center | center |
| 46 | Stop Button | `K6Fq6` | 345 | — | 14, 20 | 8 | $--radius-pill | center | center |
| 47 | Voice Sheet | `EE4c5` | 393 | — | 16, 24, 36, 24 | 20 | 28, 28, 0, 0 | center | — |
| 48 | Voice Sheet Recording | `mwCKG` | 393 | — | 16, 24, 88, 24 | 20 | 28, 28, 0, 0 | center | — |
| 49 | Voice Sheet Processing | `rc9H9` | 393 | — | 16, 24, 176, 24 | 20 | 28, 28, 0, 0 | center | — |
| 50 | Title Header | `mrtAI` | 345 | — | — | — | — | center | center |
| 51 | Header With Actions | `lTkhS` | 345 | — | — | — | — | center | space_between |
| 52 | Selection Bar | `r2DmLN` | 329 | — | 0, 8, 8, 8 | 6 | — | center | space_between |
| 53 | Transcribed Row Selected | `jSNl4` | 329 | — | 8 | 10 | $--radius-m | center | — |
| 54 | Remove Button | `Tu1ZA` | 160 | — | 14, 20 | 8 | $--radius-pill | center | center |
| 55 | Sticky Footer Remove | `eD2Hk` | 393 | — | 16, 24, 36, 24 | 12 | 20, 20, 0, 0 | — | — |
| 56 | Swipe Left Row | `awFMT` | 345 | 56 | — | — | — | — | — |
| 57 | Swipe Right Row | `bwJ0v` | 345 | 56 | — | — | — | — | — |
| 58 | Scan Title Pill | `TcO5V` | — | — | 7, 8, 7, 16 | 10 | $--radius-pill | center | — |
| 59 | Scan Hint | `c1b4AK` | 393 | — | — | 4 | — | center | — |
| 60 | Scan Frame | `U8thr7` | 318 | 518 | — | — | — | — | — |
| 61 | Document Preview Card | `EozuX` | 345 | 560 | — | — | 24 | — | — |
| 62 | Camera Round Button | `cAuFA` | 52 | 52 | — | — | 26 | center | center |
| 63 | Shutter | `aGatH` | 76 | 76 | — | — | — | — | — |
| 64 | Shutter Next | `Ng4Mx` | 76 | 76 | — | — | — | — | — |
| 65 | Confirm Round Button | `C7eWes` | 52 | 52 | — | — | 26 | center | center |
| 66 | Camera Controls Review | `JEsOq` | 393 | 120 | 12, 32, 24, 32 | — | 20, 20, 0, 0 | center | space_between |
| 67 | Camera Controls | `MglRt` | 393 | 120 | 12, 32, 24, 32 | — | 20, 20, 0, 0 | center | space_between |
| 68 | Receipt Header | `OChvO` | 335 | — | 0, 8, 8, 8 | 8 | — | center | — |
| 69 | Receipt Row | `i1pc8` | 335 | — | 10, 8 | 8 | — | center | — |
| 70 | Receipt Line | `M6ogO` | 335 | — | 6, 8 | — | — | center | space_between |
| 71 | Receipt Total | `vy4L6` | 335 | — | 10, 8, 4, 8 | — | — | center | space_between |
| 72 | Order Info Card | `T5j9W` | 351 | — | 12, 16 | 12 | $--radius-m | center | — |
| 73 | Receipt Sheet | `na05p` | 351 | — | 12, 8 | — | $--radius-m | — | — |
| 74 | Order Summary Card | `a0PPI` | 351 | — | 10, 14 | 6 | $--radius-m | — | — |
| 75 | Contact Field | `NAqRy` | 321 | — | — | 5 | — | — | — |
| 76 | Switch | `kHB3i` | 44 | 26 | 3 | — | 13 | center | end |
| 77 | Tax Card | `a3tCN6` | 351 | — | 10, 14 | 10 | $--radius-m | — | — |
| 78 | Action Footer | `GpSj3` | 393 | 104 | 4, 24 | 8 | 20, 20, 0, 0 | center | center |
| 79 | Status Card | `OhJ0o` | 345 | — | 36, 24 | 14 | 24 | center | — |
| 80 | Status Card Failed | `Vy5bJ` | 345 | — | 36, 24 | 14 | 24 | center | — |
| 81 | Progress Bar | `PLVdt` | 297 | — | 8, 0, 0, 0 | 8 | — | — | — |
| 82 | Status Card Processing | `fOnf3` | 345 | — | 36, 24 | 14 | 24 | center | — |
| 83 | Document Carousel | `J7gOX2` | 345 | 560 | — | — | 24 | — | — |
| 84 | List Title Bar | `o4Rxx` | 393 | — | 0, 28 | — | — | center | space_between |
| 85 | Status Filter Chip | `WZaGt` | — | 38 | 0, 16 | — | $--radius-pill | center | center |
| 86 | Status Filter Chip Active | `kybvT` | — | 38 | 0, 16 | — | $--radius-pill | center | center |
| 87 | Order Row | `splMx` | 329 | — | 12, 8 | 10 | — | center | — |
| 88 | Order Row Selected | `N2mad` | 329 | — | 12, 8 | 10 | 12 | center | — |
| 89 | Order Swipe Row | `IzIss` | 329 | 78 | — | — | — | — | — |
| 90 | Empty State Card | `Bf55t` | 345 | 300 | 40, 24 | 12 | $--radius-m | center | — |
| 91 | New Order Footer | `MD7i8` | 393 | 104 | 4, 24 | — | 20, 20, 0, 0 | center | center |
| 92 | Catalog Row | `h5KHMU` | 329 | — | 10, 8 | 10 | — | center | — |
| 93 | Catalog Row Swatch | `Q2WpV6` | 329 | — | 10, 8 | 10 | — | center | — |
| 94 | Price History Row | `LOzIM` | 329 | — | 10, 8 | 10 | — | center | — |
| 95 | Contact Swipe Row | `yBzFY` | 329 | 60 | — | — | — | — | — |
| 96 | Contact Swipe Row Selected | `Wl6a1` | 329 | 60 | — | — | — | — | — |
| 97 | Contact Edit Dialog | `aRs03` | 345 | — | 24 | 14 | $--radius-m | center | — |
| 98 | Profile Card | `RfF04` | 351 | — | 20, 16 | 6 | $--radius-m | center | — |
| 99 | Contact Info Card | `s0abrj` | 351 | — | 12, 8 | 2 | $--radius-m | — | — |
| 100 | Recent Orders Card | `j6LLyH` | 351 | 258 | 12, 8 | — | $--radius-m | — | — |
| 101 | Order Header Card | `AoZSA` | 351 | — | 16 | 10 | $--radius-m | — | — |
| 102 | Order Customer Card | `DxLNH` | 351 | — | 12, 8 | 4 | $--radius-m | — | — |
| 103 | Order Items Sheet | `SBGvb` | 351 | 312 | 12, 8 | 4 | $--radius-m | — | — |
| 104 | Options Menu | `DRNO2` | 160 | — | 6 | — | 16 | — | — |
| 105 | Brand Logo | `rDvMl` | 267 | 64 | — | — | — | — | — |
| 106 | Onboarding Actions | `X3sUPL` | 279 | 108 | — | — | — | — | — |
| 107 | Onboarding Actions Auth | `fLn8S` | 279 | 108 | — | — | — | — | — |
| 108 | Onboarding Text | `LMxbq` | 329 | 60 | — | — | — | — | — |
| 109 | Page Dots | `p4TPv1` | 132 | 6 | 0, 30 | 9 | — | center | center |
| 110 | Auth Tabs | `yFIyi` | 345 | — | 4 | 4 | $--radius-pill | — | — |
| 111 | Welcome Header | `i7TYR` | 393 | — | — | 4 | — | — | — |
| 112 | Social Buttons | `X0kh41` | 313 | — | — | 10 | — | — | — |
| 113 | Auth Divider | `gU4q4` | 313 | — | — | 10 | — | center | — |
| 114 | Forgot Row | `sab6j` | 313 | — | — | — | — | — | end |
| 115 | Password Rules | `l2L0R1` | 313 | — | 4, 0, 0, 0 | 6 | — | — | — |
| 116 | Terms Text | `omHzF` | 345 | — | — | — | — | — | — |
| 117 | Terms Row | `kntjB` | 345 | — | 0, 4 | 10 | — | — | — |
| 118 | Bottom Sheet | `FmI9p` | 393 | 502 | 12, 24, 28, 24 | 12 | 24, 24, 0, 0 | center | — |
| 119 | Confirm Dialog | `krp83` | 345 | — | 24 | 16 | $--radius-m | center | — |
| 120 | Edit Dialog | `qaPaF` | 345 | — | 24 | 16 | $--radius-m | center | — |
| 121 | Nav Item | `K9Ypn` | 276 | — | 11, 12 | 12 | 10 | center | — |
| 122 | Nav Item Active | `JpNMo` | 276 | — | 11, 12 | 12 | 10 | center | — |
| 123 | Sidebar Menu | `w7eOB6` | 300 | 1024 | 28, 12, 20, 12 | 28 | — | — | — |
| 124 | KPI Card | `pw90K` | 252 | — | 20 | 14 | $--radius-m | — | — |
| 125 | Setup Header | `T7jti` | 345 | — | — | 16 | — | center | — |
| 126 | Setup Option | `Ql331` | 345 | — | 16 | 14 | $--radius-m | center | — |
| 127 | Setup Option Selected | `dYbLo` | 345 | — | 16 | 14 | $--radius-m | center | — |

#121–123 (`Nav Item`, `Nav Item Active`, `Sidebar Menu` at 300×1024) belong to the desktop `Dashboard` screen (1440×1024, the file's one non-mobile frame); everything else is sized for the 393px mobile frame per the business doc's mobile-width scope.
