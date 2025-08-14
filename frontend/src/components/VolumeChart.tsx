import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VolumeChartProps {
  data: { [key: string]: number };
}

const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || Object.keys(data).length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const weeks = Object.keys(data).sort();
    const volumes = weeks.map(week => data[week]);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(weeks)
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(volumes) || 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => {
        const date = new Date(d);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }));

    g.append('g')
      .call(d3.axisLeft(y));

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Volume (lbs)');

    const bars = g.selectAll('.bar')
      .data(weeks)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', '#3B82F6');

    bars.transition()
      .duration(750)
      .attr('y', d => y(data[d]))
      .attr('height', d => height - y(data[d]));

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

    bars.on('mouseover', function(event, d) {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`Week of ${d}<br/>Volume: ${data[d].toLocaleString()} lbs`)
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function(d) {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};

export default VolumeChart;