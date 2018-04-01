install.packages('devtools')
install.packages('sf')
install.packages('mapproj')
install.packages("rgeos")
install.packages("maptools")
install.packages("rgdal")

library(tidyverse)
library(lubridate)
library(sf)
library(ggplot2)
library(dplyr)
library(rgeos)
library(maptools)
require(rgdal)

data.shape<-readOGR(dsn="C:/Users/hww50/Desktop/semester 2/max/MUSA-620-Week-2-master/MUSA-620-Week-1-master/census-tracts-philly",layer="census-tracts-philly")
plot(data.shape)
data <- fortify(data.shape, region = "GISJOIN")
write.csv(data, "C:/Users/hww50/Desktop/semester 2/capstone/data.csv")

singlenmulti <- readOGR(dsn="C:/Users/hww50/Desktop/semester 2/smtocensus",layer="smtocensus")
sale <- read.csv("C:/Users/hww50/Desktop/semester 2/singnmulti2010.csv")
sale <- sale[,c(1:2,4:25)]

saleafte2010 <- read.csv("C:/Users/hww50/Desktop/semester 2/capstone/saleafter2010.csv")
saleafter2010sm <- saleafte2010[saleafte2010$category_code_description == "Single Family"  | saleafte2010$category_code_description == "Multi Family", ]
saleafter2010sm <- saleafter2010sm[,c(1:8,10:11,13:14,16:20)]
merged <- merge(x=sale,y=saleafter2010sm, by.x=c("the_geom","lng","category_c","lat","census_tra","date"), by.y=c("the_geom","lng","category_code_description","lat","census_tract","date"))

#price more than 1000, less than 2000000
merged <- filter(merged,sale_price>1000)
merged <- filter(merged,sale_price<2000000)
merged <- merged[,c(1:32,34:35)]

#Create a new column with only the year of sale
merged$Year <- format(as.Date(merged$date), "%y")
merged <- filter(merged,total_area>0)
write.csv(merged,"C:/Users/hww50/Desktop/semester 2/sale2010priceGeojoin.csv")

#sales data only in 2010
merged2010 <- filter(merged,Year==10)
merged2010 <- filter(merged2010,total_area>0)
#sales data only in 2013
merged2013 <- filter(merged,Year==13)
merged2013 <- filter(merged2013,total_area>0)
#sales data only in 2016
merged2016 <- filter(merged,Year==16)
merged2016 <- filter(merged2016,total_area>0)
#sales data only in 2017
merged2017 <- filter(merged,Year==17)
merged2017 <- filter(merged2017,total_area>0)

#Median sales price 2010: Calculate price per sqft
price2010<-group_by(merged2010, GISJOIN) %>%
  summarise(pricesqft=sum(sale_price)/sum(total_area))
write.csv(price2010,"C:/Users/hww50/Desktop/semester 2/price2010.csv")
#Median sales price 2013
price2013<-group_by(merged2013, GISJOIN) %>%
  summarise(pricesqft=sum(sale_price)/sum(total_area))
write.csv(price2013,"C:/Users/hww50/Desktop/semester 2/price2013.csv")
#Median sales price 2016
price2016<-group_by(merged2016, GISJOIN) %>%
  summarise(pricesqft=sum(sale_price)/sum(total_area))
write.csv(price2016,"C:/Users/hww50/Desktop/semester 2/price2016.csv")
#Median sales price 2017
price2017<-group_by(merged2017, GISJOIN) %>%
  summarise(pricesqft=sum(sale_price)/sum(total_area))
write.csv(price2017,"C:/Users/hww50/Desktop/semester 2/price2017.csv")

#unneccessary
price2017 <- data.frame(lapply(price2017, as.character), stringsAsFactors=FALSE)
price2017$pricesqft <- as.numeric(as.character(price2017$pricesqft))

#join price to census tract
plotData2010 <- left_join(data, price2010, by=c("id" = "GISJOIN"))
plotData2013 <- left_join(data, price2013, by=c("id" = "GISJOIN"))
plotData2016 <- left_join(data, price2016, by=c("id" = "GISJOIN"))
plotData2017 <- left_join(data, price2017, by=c("id" = "GISJOIN"))

#Creating breaks 
plotData2010$range <- factor(
  cut(plotData2010$pricesqft, c(0, 50, 100, 200, 400, 600, 800, 9999999)),
  labels = c("Less than 50", "50 to 100","100 to 200","200 to 400", "400 to 600", "600 to 800", "More than 800")
)
plotData2013$range <- factor(
  cut(plotData2013$pricesqft, c(0, 50, 100, 200, 400, 600, 800, 9999999)),
  labels = c("Less than 50", "50 to 100","100 to 200","200 to 400", "400 to 600", "600 to 800", "More than 800")
)
plotData2016$range <- factor(
  cut(plotData2016$pricesqft, c(0, 50, 100, 200, 400, 600, 800, 9999999)),
  labels = c("Less than 50", "50 to 100","100 to 200","200 to 400", "400 to 600", "600 to 800", "More than 800")
)

plotData2010$idval <- gsub("G","",plotData2010$id)

write.csv(plotData2010,"C:/Users/hww50/Desktop/semester 2/plotData2010new.csv")
write.csv(plotData2013,"C:/Users/hww50/Desktop/semester 2/plotData2013.csv")
write.csv(plotData2016,"C:/Users/hww50/Desktop/semester 2/plotData2016.csv")


price2010$range <- factor(
  cut(price2010$pricesqft, c(0, 20, 50, 80, 150, 250, 500, 9999999)),
  labels = c("Less than 20", "20 to 50","50 to 80","80 to 150","150 to 250", "250 to 500", "More than 500")
)
write.csv(price2010,"C:/Users/hww50/Desktop/semester 2/price2010N.csv")

price2013$range <- factor(
  cut(price2013$pricesqft, c(0, 20, 50, 80, 150, 250, 500, 9999999)),
  labels = c("Less than 20", "20 to 50","50 to 80","80 to 150","150 to 250", "250 to 500", "More than 500")
)
write.csv(price2013,"C:/Users/hww50/Desktop/semester 2/price2013N.csv")

price2016$range <- factor(
  cut(price2016$pricesqft, c(0, 20, 50, 80, 150, 250, 500, 9999999)),
  labels = c("Less than 20", "20 to 50","50 to 80","80 to 150","150 to 250", "250 to 500", "More than 500")
)
write.csv(price2016,"C:/Users/hww50/Desktop/semester 2/price2016N.csv")

price2017$change <- (price2017$pricesqft - price2010$pricesqft)/ price2010$pricesqft
price2017$percentchange <- factor(
  cut(price2017$change, c(-1, -0.5, 0, 0.5, 0.8, 1.5, 3, 9999999)),
  labels = c("Decrease more than 50%", "Decrease less than 50% ", "Increase less than 50%", "Increase 50% to 80%", "Increase 80% to 150%", "Increase 150% to 300%", "Increase more than 300%")
)
price2017 <- price2017[,c(2:5)]
write.csv(price2017,"C:/Users/hww50/Desktop/semester 2/price2017new.csv")

price2017$idval <- gsub("G","",price2017$GISJOIN)
price2017$idval <- as.factor(price2017$idval)

#Generate the final map
ggplot(data = price2017, aes(x = long, y = lat, group = group,
                            fill = percentchange) ) +
  # drop shadow: draw another map underneath, shifted and filled in grey
  geom_polygon(aes(x = long + 0.005, y = lat - 0.002), color = "grey50", size = 0.01, fill = "grey50") +
  geom_polygon(color = "grey10", size = 0.01) +
  # set the projection (Mercator in this case)
  coord_map() +
  #set the color scale
  scale_fill_viridis( discrete = TRUE, direction = -1, option = "A") +
  #scale_fill_brewer(palette="Greens") +
  labs(title = "Housing Market Seasonality in Philadelphia, (2010 - 2017)",
       subtitle = "The Number of Home Sales in January by Zip Code",
       caption = "Open Data Philly, Properties",
       # remove the caption from the legend
       fill = "Number of Sales") +
  #set the plot theme
  theme_void() +
  #theme_bw() +
  theme(text = element_text(size = 8),
        plot.title = element_text(size = 12, face = "bold"),
        panel.background = element_rect(fill = "NA", colour = "#cccccc"),
        plot.margin = unit(c(0.25, 0.25, 0.25, 0.25), "in"),
        legend.text = element_text(size = 7),
        legend.position = c(0.8, 0.25)) +
  annotate("text", label = "January", x = -75.2, y = max(price2017$lat), color = "lightsalmon4", size =8)
#Repeat this step for 12 times to create a map for each month
