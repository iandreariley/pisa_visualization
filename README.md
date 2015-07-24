# Visualization of the PISA dataset
#### by Ian Riley

## Use

The most recent version of the project can be downloaded in its entirety here:
https://github.com/iandreariley/pisa_visualization/tree/filtered/

To run it locally, put both the pisa_by_country_and_wealth_filtered.tsv and index.html
files in the same directory. In that same directory, create a new sub-diretory called
"css", and place the main.css file inside it.
Use 'python -m SimpleHTTPServer' to get a server running in the root directory (the one
with index.html in it). Open a browser and type localhost:8000 in the url field,
and the visualization should start.

To see the visualization online go [here][old] for the first version, [here][new] for the
second version. The most current version is not yet available on the internet.

[old]:http://www.iandreariley.com/pisa.html
[new]:http://www.iandreariley.com/pisa_updated.html
## Process

The Pisa dataset is a large one. I noticed that it used a column for each question
on each questionare. I knew that I wouldn't be using all of these variables (there
are some 640 of them) so the first thing I did was look through the data and
determine which variables I was going to use, and make a smaller dataset.

The variable names, even with the aid of the data dictionary, are confusing. So it
was difficult to pick which columns to use for analysis. Specifically, I had trouble
finding a variable relating to the score, which is really the metric of interest
(that is, I and others want to know which variables correlate with score so that
we might discover what conditions make for strong education). After some searching
on the interenet, I found code on [this website][1] that used the mean of the
PV<subject><n> (e.g. PVMAT1) scores as the total score in that subject.

Each score seems to be comprised of 5 'Plausible Values', according to the dataset
and the accompanying dictionary (e.g. 'PVMAT1' stands for 'Plausible value 1 in
mathematics')

### Design

My initial thoughts for design came from two main sources. First, I knew I wanted to
make a "martini glass" style presentation, because I felt there was a story to tell
with the data, but I also wanted to allow the use the opportunity to explore the data
on their own. As an audience member, I always like being able to experience data
visualizations on my own terms. Second, I was inspired by the New York Times
visualization, [The Jobless Rate for People Like You][a]. I thought it was an engaging
and effective way to allow users to explore data on their own. I liked it's use of
tooltips and mouse-over highlighting to allow quick exploration of the data, as well
as a selection feature for closer inspection of specific groups. I wanted the open
end of my "martini glass" to be a similarly interactive chart.

Creating the stem of the "martini glass" as a series of slides projected on the chart
seemed like an obvious choice. I liked the similar approach used in the d3 class'
example using world cup data. Initially I worked with timed slides, although I didn't
like the way it pressured the user to take everything in so quickly, so I incorporated
buttons that allowed the user to move backwards and forwards through the slides.

Per the recommendations of the class, I used a grey-scale and mostly unsaturated
colors to make the visualization easier to look at. In order to make the slides
color-blind friendly, I used blue and gold for highlighting China(Shaghai) and
the United States on a slide that compared the two.For highlighting the final slide,
which allows the user to select a country, the highlight and select colors are
dark-red and brown respectively, which I find easier on the eyes than the bright
red I used initially.

For the open end of the "martini glass" I designed a chart much like the one
used for the joblessness visualization by the New York Times.However, initially, I
used only a mouseover tooltip to display data.

[a]:http://www.nytimes.com/interactive/2009/11/06/business/economy/unemployment-lines.html

### Choosing Variables

As mentioned above there are hundreds of variables in the PISA dataset. My interest
was seeing which variables could predict good test scores, so I immediately excluded
questions from the test itself (as they are part of the test scores). I decided to
use the mean of scores for each major and minor subject (math, reading, science).
The variables I chose are:

#### Potential Predictor Values

- "CNT": Country code (3 character)
- "SUBNATIO": sub-region 7 digit code (3 digit country code + region id + stratum id)
- "ST04Q01": Gender
- "ST08Q01": Late for school
- "ST09Q01": Skipped School
- "ST115Q01": Skipped Class during school day
- "ST20Q01": Country of Birth (note: ~9,000 NAs)
- "ST21Q01": Age of arrival in <country of test> (note: ~45,000 NAs)
- "ESCS": Index of economic, social and cultural status (note: ~ 12,000 NAs)
- "ANXMAT": Mathematics anxiety
- "HOMEPOS": Home possessions (note: ~6,000 NAs)
- "WEALTH": Wealth (note range: [-6.65, 3.25], median: -.3, mean: -.337, ~ 6,000 NAs

#### Predicted Values

- "PV1MATH","Plausible value 1 in mathematics"
- "PV2MATH","Plausible value 2 in mathematics"
- "PV3MATH","Plausible value 3 in mathematics"
- "PV4MATH","Plausible value 4 in mathematics"
- "PV5MATH","Plausible value 5 in mathematics"
- "PV1READ","Plausible value 1 in reading"
- "PV2READ","Plausible value 2 in reading"
- "PV3READ","Plausible value 3 in reading"
- "PV4READ","Plausible value 4 in reading"
- "PV5READ","Plausible value 5 in reading"
- "PV1SCIE","Plausible value 1 in science"
- "PV2SCIE","Plausible value 2 in science"
- "PV3SCIE","Plausible value 3 in science"
- "PV4SCIE","Plausible value 4 in science"
- "PV5SCIE","Plausible value 5 in science"

### Shaping

I renamed the predictor variables to make them more reader friendly and aggregated
the 'PV' variables into three averaged (arithmetic mean) scores. The new shape of the
data was then:

##### Predictor values

- country
- region
- gender
- tardy
- absent_day
- absent_class
- birth_country
- immegration_age
- socio_economic_index
- math_anxiety
- home_possessions
- wealth

##### Predicted values

- math_score
- science_score
- reading_score

### Cleaning

Some issues arose during univariate analysis of the smaller dataset:

- In the 'country' variable, Massachusetts, Connecticut and Florida are listed as
  separate from the United States of America.
- I was curious about how immigration age affects the scores of all tests, however
  I found that about 98% of the values for this variable are NAs. I was not
  immediately sure whether to impute values, use only non NA values, or dump the
  variable entirely
- The region code was read in by R as a numeric variable, rather than a string. This
  wasn't a huge problem; however it raised the question of whether it was adding any
  value at all.
  
A cursory Google search yielded a [Washington Post][2] article which explained that
the reason for separating the three states mentioned above were used as benchmarks
for the US. The total observations from those three states is greater than the total
number of observations for the rest of the US, so I decided to keep them separate
from the US data, in order not to overrepresent those states in the US scores.

Impution seemed like a bad way to handle the immegration_age variable. Looking at the
birth_country variable, which is only about 1.8% NAs, its evident that most students
were born in the country in which they were taking the test. Therefore I assumed that
most of the NAs in the immegration_age variable are students who are not immigrants,
and that the limited amount of data will be helpful anyway.

The region variable I kept because I may have decided to use it later.

### Exploratory Analysis

#### Notes on Variables
- According to [Statistics Canada][3] 'Wealth' is an index determined by whether the
  student had the following at home:
  1. His or her own room
  2. A dishwasher
  3. An internet connection
  4. A DVD player
  5. Three other country-specific items
- According to the [Organization for Ecomonic Co-operation and Development][4]
  (OECD), 'ESCS', the Economic, Social and Cultural status index is based on the
  following variables:
  1. The International Socio-Economic Index of Occupational Status (ISEI)
  2. The highest level of education of the student's parents
  3. The wealth index
  4. The index of home educational resources
  5. The index of possessions related to classic culture at home.

#### Univariate Observations
- Reading, math and science scores all have normal distributions.
- Immigration age is mostly NA values.
- For immigration age values that exist, a surprising number of them are non-zero
  (>50%).

#### Bivariate observations
- Some countries perform much better than others on average
- The strongest correlation I observered was between math/science scores and the
  ESCS index (r = ~0.40).
- There is also a strong correlation between math anxiety and math scores
  (r = ~ -0.37).
- Median math score goes down significantly with all measures of truancy
- The median reading score for women appears to be about fifty points higher than
  the score for men
- The median math score is slightly higher for men than for women

#### Multivariate observations

### Visualization ideas

After looking at various plots in R, what struck me most is the relationship
between wealth/escs and math_score. Plotting wealth against math score and
facetting by country shows that some countries have relatively equal opportunity
across the wealth spectrum, while other countries have dramatic differences in scores
between their richer and poorer students.

However, countries across the board show a generally positive correlation between
the escs index and math score, suggesting that perhaps even the countries that
seem to have equal opportunity are not as equal and they first appear.

Ultimately, I decided to examine the relationship between the wealth index and math
score. 


### Feedback

#### Udacity
The following are excerpts from the review of my first submission to Udacity
that I address in this submission:

>For certain wealth categories (especially the lowest and the highest) (and country facets)
there are very few data points that fall into a particular ‘bucket’.
For example, the marked ‘bump’ in the overall mean mathematics score for the lowest
wealth scores comes entirely from the values from two countries (Vietnam and Malaysia)..
There are only 56 students with wealth score -6.0 and a single student with wealth score
-6.5. This feature of the graphic is likely to catch a viewer’s eye and could easily be
misleading! Similar artefacts for the extreme values can also be observed for individual
countries. I suggest that you shorten the lines on your graphic to show only means that
have been calculated from ‘large enough’ (and perhaps also ‘varied enough’?) samples of
data, so that we can have some confidence that these lines are reflecting genuine trends
in the data.
You might also consider including sample sizes, error bars or some other way of
evaluating the degree of confidence the viewer should have in the value shown. This could
get complicated with your final graphic, however!

>My other concern is more difficult to solve.
The mean values of the test scores for all countries is a really useful thing to want to show!
By taking the arithmetic mean of all elements of the dataset, we have effectively created a
weighted mean by country, where each country is weighted by the number of elements it
has in the dataset. There is nothing to say that this weight is a good one to use or this
aggregation!
This is a very typical issue to encounter when aggregating data and does not have an easy
answer. How might you attempt to accurately represent the global relationship between
(PISA) wealth and (PISA) mathematics score using this data? How might you find some
suitable weights? There is no single correct answer here, and I think addressing this is
beyond the scope of this project, but I encourage you to think about possible solutions
and implement one if you can.

>You’ve done a great job of implementing a ‘martini-glass’ narrative in this visualisation!
I note that the dotted lines for USA and Shanghai (China) have different meanings on
consecutive views of the visualisation: first mean, then maximum and minimum. You
could distinguish these by making the lines more visually different or by adding labels.
I like the fact that there is a drop-down menu to highlight lines, as well as the mouseover.
This makes the final view easier to use.
To make the final graphic more interactively usable, you should consider ways to make
the information for each individual country easier to see. For example, it might be useful
to display information for a chosen country somewhere in the main screen rather than on
a tooltip. You could also consider allowing highlighting of a country via clicking, as well as
or instead of a mouseover.

The following are emails I recieved back from friends who took a look at the
project, which I shared on [my website][ http://iandreariley.com/pisa.html].

#### Stephanie

>This is so cool!  I loved the graph at the end.  The only thing I noticed is that it
seems that the "Florida, USA" link does not work.  But that could have been my
computer.  Way to go.

#### Cole

> 1. I understood the graphics.
> 2. Only thing I saw is that on the first page "Half a millions" should be "Half a
> million."  I think?

#### Julia

>Nice!

>My first couple questions were actually answered by following images.  I really like
the horizontal lines and definition of the range between scores.  That was my main
initial burning question because it was hard to see where the line fell on the
y-axis.

>To formally answer your questions:
Is there anything you don't understand about the graphic?
No
What was your main takeaway from the visualization?
Wealth brackets between about -2 and 1 follow more of a predictable pattern between
nations, with more wealth predicting higher math scores.  The outlying groups (the
more impovershed and more wealthy) are less predictable.
What questions do you still have about the data?
I wonder why the dip in math scores in the wealthy groups?  Is this because of Paris
Hilton and Nicole Richie?
Are there any spelling or usage errors or inconsistencies?
On the first image it says 'half a millions'.  I think you might mean million
(singular).
Great work!  Thanks for sharing.  Go you!

#### Julia 2

>Oh yeah, so is the overall average (the bold line) just averaging Vietnam and
Malaysia for the below -5 wealth?  I didn't pick up on that the first time.  Depends
on what you're going for, but yeah I might remove the below -5 groups like you say.  

>I just noticed something else.  The overall average (bold line) - are we given the
numerical average?  On the last 'page', when hovering over each country's line, you
get the numerical average, but I don't know if the number is better or worse than the
overall average (numerically).

>Seriously all I've been doing all day long for days is looking at data and yours is
really high-end.  If all the data I've been staring at looked that good and was that
user-friendly my life would be so much easier right now.  High-five.

#### Dad

>Looks good. I'm a big fan of the data presentations of "the upshot" at the New York
Times online version, and this is very like -- really indistinguishable from what
they do. That said, some of the lines on the last page didn't light up when using
the drop down menu -- Massachusetts, Connecticut, USA, and Perm? Not sure if they
were highlighted by the cursor.

#### Mom

>Wow! Really great. 
My only suggestion is that you make a way to go back - at least on the last page to
get back to the start. 
Dad adds that the locations that didn't light up seemed all to be subsidiary places
such as states within the USA and Perm in the Russian federation. He was wrong about
USA - it worked fine. 
Good work, mister data wrangler!

#### Mom 2

>Just noticed an anomaly this AM when my computer was still displaying the last of
your charts: when I pointed my cursor at the left-most part of the line representing
average PISA score (because I couldn't recall what it represented), a little box came
up saying it was Shanghai's scores . . . 
Over and out

#### Arian

>Is there anything you don't understand about the graphic?

>No you killed it!

>What was your main takeaway from the visualization?

>Even if you're smart in Singapore, you're hella poor. Also it indirectly showed the wealth disparity between nations. So many of the countries that participated in the assessment didn't even go past -5 wealth. (I see you Ireland/UK) (and poor Malaysia) (but is that also due to scarcity of the amenities mentioned earlier?)

>Are there any spelling or usage errors or inconsistencies?

>In Equitability Within an Economy, it says "the disparity between the USA's lowest
scoring and hightest scoring brackets is 100 points" 

>Also Connecticut, Florida, and Massachusetts are listed in the Countries drop down
menu. 

>Hope this was helpful, great work dude! Loved the mouse over/drop down menu page, fascinating!

#### Arian 2

>Sorry I should've been more specific, it was after a long day!

>In " Equitability Within an Economy" 'Hightest' should be 'highest' I'm guessing.

#### Michael

>Ok, seriously and honestly, everything made sense and was clear.

>A couple questions: I'm guessing some countries didn't have scores for wealth below
-5, thats why in the final graphic so many didn't have data plotted below -5,
correct?  Or is it that Ireland is balling out of control and no one is poor there?
This made me wonder how every country had data plotted up to the maximum wealth of 3.
I though most would "max out" before that.  

>Or maybe I misunderstand this whole thing?  In which case, I assure you, it is my
fault not yours.  

>Also why is it that nearly every country saw a math score dip between wealth at 2 and
3?  My best guess is that Jordanian actors, singers and dancers are wealthy but not
really educated.

#### Daniel

>Question on the PISA wealth index:  since it a scale that most probably aren't
familiar with, would it be appropriate to put it in some context? Like 0 = average,
1 = top 50%, 2 = top 25% etc etc? Why are there so many more wealth brackets below
zero than above–based on percentage of population? There are way more poor people
than rich?

>Wealthy Jordanians are the worst at math.

>That dip in the highest wealth brackets is fascinating. 

>No spelling or usage errors that I saw.

#### Alexandra

>When my cursor hovers above the "next" button it doesn't change to a hand to indicate
that it's a button to click on. It turns into, like the cursor for a word doc.
Can you not go backwards on the slides?
The comparing two economies says: "130 points = 3 years of schooling", but the slide
before had a > instead of a =.

### Reiteration

#### First Iteration: Emails
The big takeaways from the emails were the need for a "back" button and that the
state (Mass, Conn. and FLA) didn't light up when they were selected from the drop
menu, which I hadn't noticed. It turns out this was a regex problem: In the
javascript replace function, I hand't specified a way to remove parentheses, which
resulted in a bunch of bad ids for the path elements for the states, which meant I
couldn't access them by id.
The back button took some doing, but it really cleaned my code up (by necessity) and
made the display a lot more user friendly. There's a natural desire to go back and
look at previous information once you've done some exploration of the data on your
own.

#### Second Iteration: Udacity Review
###### Ironing out possible false trends in the data.
The Udacity reviewer makes a good point that some of the wealth-bin averages are
drawn from samples that are too small. To remedy this, I first decided on a
threshold to define a "large enough" sample. Specifically, I wanted to be 
relatively certain that the average math score for a given wealth-bin was within
a year's worth of schooling. As mentioned elsewhere, a year of schooling is
approximately 40 points on the math test. Therefore, I removed datapoints that had
a 95% confidence interval greater than +-20 points. I calculated this value by
finding the two-tailed t-critical value for 95% confidence at n degrees of freedom
for sample-size n, and multiplying that by the standard error of the sample.
To keep the page loading time short, I did this work in R and exported the massaged 
data to a .tsv file that is loaded by the d3 code, rather than having d3 do the work
on the entire dataset in response to a get request. Rather than including error bars
or other indications of that threshold, I decided to simply state it in the text. I
felt that error bars would make the graphic too cluttered and unreadable.

###### Weighting the Cumulative Mean
The second point made by the Udacity reviewer is that, by calculating the cumulative
mean of math scores, I had unwittingly weighted countries by their PISA sample size
which, as he points out, is an arbitrary and unhelpful weight. I decided to remedy
this by weighting the scores of each country in each wealth bin by the population
of that country. Given that the visualization is largely about understanding global
population trends, I think that population is a fitting weight. However, this raised
another issues in creating the curve for the cumulative mean: How many, or which
countries should be represented in calculating data points for the mean?

For example, while we may have datapoints that are within the 40 point confidence
threshold, is it safe to calculate the mean if the only contributing country is
Latvia (population ~ 2 million)? I found this question hard to answer. Ultimately,
I decided that I would again base the decision on population: I wanted to make sure
that the datapoints at least represented a big chunk of the population that was
sampled, so I decided that if the cumulative population of all the countries
representing a given wealth bin was at least 50% of the total population sampled
by PISA, I would include that wealth bin in the mean line, otherwise, I excluded it.

###### Improving the Interactivity
The review also points out that it would be nice to display more information about
a country than is provided in the tool tip, and to allow users to select countries.
I improved the interactive features at the end by allowing users to select lines
by clicking them, as well as by using the drop-down menu. I also included a side
panel that displays more information about the country.

Also in this iteration I updated the CSS classes of clickable elements so that the
mouse pointer indicates (with the pointer value) that an element is clickable.
This is in response to Alexandra's email, and I feel sort of silly for not having
done it sooner; it was an easy fix.

### Troubles

My main issue with d3 was subsetting my nested data. I first tried the following:

var filtered = nested.filter(function(d) { return d['key'] === foo })

var shapes = d3.selectAll('path')
    .data(filtered)
    .enter()
    .append('path')
    .attr('d', function(d) { //accessor })

But it didn't work.
However, this did:

var shapes = d3.selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .filter(function(d) { return d['key'] == foo })
    .attr('d', function(d) { //accessor })

That particular solution I found on [stack overflow][5]. Thank goodness for that
site.

## References

1. http://stackoverflow.com
  - [Getting row means in R][rowMeans]
  - [Dropping columns by pattern matching in R][dropColumnsPattern]
  - [Finding non-numeric data in a column R][findNonNumeric]
  - [Center a ul element][center_ul]
  - [Remove all elements from an svg with D3.js][clear_svg]
2. [Quick-R][quickr]
3. http://www.w3schools.com
  - [Creating a navigation bar with a ul element][nav_bar]
4. [Nesting in D3][nest]
5. [Drawing a line with D3][draw_line]
6. [Rounding in javascript][round]
7. [Adding arrow marker to SVG line][marker]
[1]:https://haigen.wordpress.com/sample-sas-code-for-timss-data/
[2]:http://www.washingtonpost.com/blogs/answer-sheet/wp/2013/12/03/key-pisa-test-results-for-u-s-students/
[3]:http://www.statcan.gc.ca/pub/81-595-m/2011092/section/app-ann03-eng.htm
[rowMeans]:http://stackoverflow.com/questions/9490485/how-can-i-get-the-average-mean-of-selected-columns]
[4]:http://stats.oecd.org/glossary/detail.asp?ID=5401
[5]:http://stackoverflow.com/questions/20335118/filter-data-in-d3-to-draw-either-circle-or-square
[dropColumnsPattern]:http://stackoverflow.com/questions/15666226/how-to-drop-columns-by-name-pattern-in-r
[findNonNumeric]:http://stackoverflow.com/questions/21196106/finding-non-numeric-data-in-an-r-data-frame-or-vector
[quickr]:http://www.statmethods.net/
[nav_bar]:http://www.w3schools.com/css/css_navbar.asp
[center_ul]:http://stackoverflow.com/questions/544207/can-you-help-me-center-a-ul-element-with-css
[clear_svg]:http://stackoverflow.com/questions/22452112/nvd3-clear-svg-before-loading-new-chart
[nest]:https://github.com/mbostock/d3/wiki/Arrays#-nest
[draw_line]:http://www.sitepoint.com/creating-simple-line-bar-charts-using-d3-js/
[round]:http://stackoverflow.com/questions/1726630/javascript-formatting-number-with-exactly-two-decimals
[marker]:https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
