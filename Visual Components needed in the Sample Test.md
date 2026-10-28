Visual Components needed in the Sample Test (does not represent absolute sample)

Excellent, for the questions that used images/supporting visuals, which visual component is needed?  
For the Geometry section, the items with supporting visuals map to these SRS Pre‑Dev visual components:

\| Item(s) \| Supporting visual in PDF \| Required visual component(s) \|  
\|---\|---\|---\|  
\| \*\*3\*\* \| Circle on Cartesian plane with center, y‑intercepts, dashed projections \| \`CartesianPlane\` \+ \`Circle\` \+ \`Point\`/\`Label\` \+ dashed projection lines \|  
\| \*\*5\*\* \| Circle \`d\` on Cartesian plane with center, top/bottom points, dashed y-projections \| \`CartesianPlane\` \+ \`Circle\` \+ \`Point\`/\`Label\` \+ dashed projection lines \|  
\| \*\*6\*\* \| Four answer-option graphs (A–D), each a mini coordinate plane with a circle \| \`MultiViewGrid\` (2×2) → each view uses \`CartesianPlane\` \+ \`Circle\` \+ \`Point\`/\`Label\` \|  
\| \*\*9\*\* \| Radar coverage circle with center \`O\` and device points P, Q, R, S \| \`CartesianPlane\` \+ \`Circle\` \+ \`Point\`/\`Label\` \|  
\| \*\*12\*\* \| Metal-piece profile: curve, straight segment, base, vertical side, grid \| \`CartesianPlane\` \+ \`CurveRegion\` \+ \`Line\` \+ \`Point\` \|  
\| \*\*13\*\* \| Bridge/ramp profile: curved section, vertical supports, base \| \`CartesianPlane\` \+ \`CurveRegion\` \+ \`Line\` \|  
\| \*\*19\*\* \| Polygon QRPS on Cartesian plane with labelled vertices \| \`CartesianPlane\` \+ \`Polygon\` \+ \`Point\`/\`Label\` \|  
\| \*\*20\*\* \| Polygon DEFGHIJ on Cartesian plane with labelled vertices \| \`CartesianPlane\` \+ \`Polygon\` \+ \`Point\`/\`Label\` \|  
\| \*\*21–23\*\* \| Shared figure with polygons \#1–\#4 on Cartesian plane \| \`CartesianPlane\` \+ \`Polygon\` \+ \`TransformationOverlay\` (shared context/group) \|

So the distinct reusable components needed are:

\- \`CartesianPlane\` (\#1)  
\- \`Circle\` (\#2)  
\- \`Line\` (\#3)  
\- \`Point\` \+ \`Label\` \+ dashed projection lines (\#4)  
\- \`Polygon\` (\#5)  
\- \`CurveRegion\` (\#7)  
\- \`TransformationOverlay\` (\#13)  
\- \`MultiViewGrid\` (\#14)

Not needed for this sample’s visuals: \`FunctionPlot\`, \`BoxPlot\`, \`DistributionCurve\`, \`VennDiagram\`, \`Table\`, and \`3DSolid\`. Items 16–18 are word problems with no figure in the provided PDF; if you later add high‑fidelity 3D illustrations for the sphere/cylinder cross‑sections, they would use the \`3DSolid\` component (\#12). Items 14–15 contain formula images (\`a \= r√3/2\`, \`m∠i \= 180(n−2)/n\`), which should be rendered with KaTeX/LaTeX, not a geometry visual component.

For the \*\*Statistics section (items 49–60)\*\*, the supporting visuals map to only \*\*four component families\*\*: \`Table\` (with sub‑variants), \`DistributionCurve\`, \`VennDiagram\`, and \`BoxPlot\`. Items whose \`visual\_spec\` is \`null\` still need a visual because they share a \*\*group‑level\*\* context visual.

\| Item(s) \| Supporting visual in source \| Required visual component \| Sub‑variant / notes \|  
\|---\|---\|---\|---\|  
\| \*\*49\*\* \| Frequency distribution table (km walked) \| \`Table\` \| \`frequency\_table\`; includes total row \|  
\| \*\*50\*\* \| Weighted grading table (rubric percentages) \| \`Table\` \| \`weighted\_table\` \|  
\| \*\*51\*\* \| Skewed distribution curve with dashed median/mode markers \| \`DistributionCurve\` \| \`negatively\_skewed\`; markers at 80 and 85 dashed to x‑axis \|  
\| \*\*52\*\* \| Five‑number summary table (Min, Q1, Me, Q3, Max) \| \`Table\` \| \`summary\_table\` \|  
\| \*\*53–54\*\* \| Shared contingency table (\`Acompañamiento / Bebida\`) \| \`Table\` \| \`contingency\_table\`; render once for group \`g\_cont\_table\` \|  
\| \*\*55–56\*\* \| Shared 3‑set Venn diagram (Música, Pintura, Ballet) \| \`VennDiagram\` \| \`venn\_3set\`; render once for group \`g\_venn\_3set\` \|  
\| \*\*57–58\*\* \| Shared dual box plots (employee ages, Empresas A/B) \| \`BoxPlot\` \| \`box\_plot\_group\`; render once for group \`g\_emp\_ages\`; verify values against original PDF because extraction was corrupted \|  
\| \*\*59–60\*\* \| Shared group statistics table (means/std devs by group H/Q/S/P) \| \`Table\` \| \`stats\_table\`; render once for group \`g\_volunteer\` \|

\#\#\# Key implication for pre‑dev  
The Statistics section needs:

1\. \*\*\`Table\` component with five sub‑variants\*\*  
   \- \`frequency\_table\`  
   \- \`weighted\_table\`  
   \- \`summary\_table\`  
   \- \`contingency\_table\`  
   \- \`stats\_table\`

2\. \*\*\`DistributionCurve\`\*\* for item 51\.

3\. \*\*\`VennDiagram\`\*\* with a canonical 3‑set region schema for items 55–56.

4\. \*\*\`BoxPlot\`\*\* with grouped/dual rendering for items 57–58.

All four component families are already in the Pre‑Dev component inventory, so \*\*no new primitive is required\*\* for the Statistics section. The main pre‑dev adjustment is to expand the \`Table\` specification into the five sub‑variants above and to document the \*\*group‑level render‑once\*\* behavior for shared contexts.

For the \*\*Functions section\*\*, only \*\*six items\*\* use supporting visuals (with 26–27 sharing one visual). Required components, mapped to the Pre‑Dev component inventory:

\| Item(s) \| Supporting visual \| Required visual component(s) \|  
\|---\|---\|---\|  
\| \*\*24\*\* \| Four graphs labelled A–D, testing whether each relation is a function \| \*\*\`MultiViewGrid\`\*\* (2×2 layout) \+ \*\*\`CartesianPlane\`\*\* \+ \*\*\`Point\`/\`Label\`\*\* \+ \*\*\`Line\`/\`Ray\`\*\* \+ a generic \*\*\`Curve\`/\`Path\`\*\* primitive for the non‑standard curves in A and C. \`FunctionPlot\` alone is insufficient unless it supports arbitrary sampled paths. \|  
\| \*\*26–27\*\* (shared \`fuel\_price\` group) \| Piecewise-linear fuel-price graph, with labelled points and dashed projections to axes \| \*\*\`CartesianPlane\`\*\* \+ \*\*\`Polyline\`\*\* (piecewise linear function) \+ \*\*\`Point\` \+ \`Label\`\*\* \+ \*\*\`dashed projection lines\`\*\*. No separate \`FunctionPlot\` needed unless implemented as a piecewise function plot. \|  
\| \*\*29\*\* \| Parabola opening downward, vertex at (−1, 5), roots at −4 and 2, dashed lines to axes \| \*\*\`CartesianPlane\`\*\* \+ \*\*\`FunctionPlot\`\*\* (quadratic) \+ \*\*\`Point\` \+ \`Label\`\*\* \+ \*\*\`dashed projection lines\`\*\*. \|  
\| \*\*36\*\* \| Parabola $h(x)={x}^{2}-4$, vertex (0, −4), roots −2 and 2 \| \*\*\`CartesianPlane\`\*\* \+ \*\*\`FunctionPlot\`\*\* (quadratic) \+ \*\*\`Point\` \+ \`Label\`\*\*. \|  
\| \*\*39\*\* \| Original line $p$ through (0, −3) and (6, 0), plus four option graphs A–D \| \*\*\`MultiViewGrid\`\*\* (1 original \+ 4 options) \+ \*\*\`CartesianPlane\`\*\* \+ \*\*\`Line\`\*\* \+ \*\*\`Point\` \+ \`Label\`\*\*. \|

\#\#\# Minimal component set required by these visual items  
1\. \*\*\`CartesianPlane\`\*\* — axes, arrows, ticks, labels (all visual items).  
2\. \*\*\`MultiViewGrid\`\*\* — item 24 (2×2), item 39 (1+4).  
3\. \*\*\`Point\` \+ \`Label\`\*\* — all visual items.  
4\. \*\*\`dashed projection lines\`\*\* — items 26–27, 29\.  
5\. \*\*\`Line\` / \`Ray\`\*\* — items 24, 39\.  
6\. \*\*\`Polyline\`\*\* — items 26–27.  
7\. \*\*\`FunctionPlot\`\*\* (quadratic) — items 29, 36\.  
8\. \*\*Generic \`Curve\`/\`Path\`\*\* — item 24 (options A and C), because these are arbitrary smooth curves, not standard algebraic function plots.

\*\*Not required in this section:\*\* \`3DSolid\`, \`BoxPlot\`, \`DistributionCurve\`, \`VennDiagram\`, \`Table\`, \`TransformationOverlay\`, \`CurveRegion\`, \`InteractiveControls\` (unless learning-mode enhancements are added later).  
